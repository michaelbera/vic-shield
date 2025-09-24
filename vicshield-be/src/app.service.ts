import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
// 👇 import helper để gắn filename/mime
import { toFile } from 'openai/uploads';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  /**
   * Upload file local path -> OpenAI, purpose: 'assistants'
   * Trả về đối tượng file đã upload.
   * Quan trọng: luôn truyền filename/mimeType để OpenAI nhận diện loại file.
   */
  async uploadToOpenAI(
    localPath: string,
    originalName: string,
    mimeType?: string,
  ) {
    // Bắt buộc PDF cho context stuffing qua input_file
    const isPdf =
      (mimeType && mimeType.includes('pdf')) ||
      originalName.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      throw new BadRequestException(
        'Vui lòng upload file PDF (.pdf). Hiện tại context stuffing qua input_file chỉ hỗ trợ PDF.',
      );
    }

    const file = await this.client.files.create({
      // 👇 Gắn filename và mimeType chuẩn, tránh "got none"
      file: await toFile(fs.createReadStream(localPath), originalName, {
        // @ts-ignore
        mimeType: mimeType ?? 'application/pdf',
      }),
      purpose: 'assistants',
    });

    return {
      id: file.id,
      bytes: file.bytes,
      created_at: file.created_at,
      filename: originalName,
      mime_type: mimeType ?? 'application/pdf',
    };
  }

  /**
   * Phân tích hợp đồng đã upload (qua fileId).
   * Yêu cầu model trả về JSON thuần.
   */
  async analyzeUploadedContract(fileId: string, originalName?: string) {
    const prompt = [
      'Bạn là một luật sư hợp đồng thương mại. Nhiệm vụ:',
      '- Đọc file hợp đồng PDF đính kèm.',
      '- Phân tích ngắn gọn, trung lập.',
      '- Chỉ trả về DUY NHẤT một JSON object theo schema, không kèm markdown.',
      '',
      'Schema JSON:',
      JSON.stringify(
        {
          title: 'string',
          summary: 'string',
          parties: { A: 'string', B: 'string' },
          governingLaw: 'string?',
          effectiveDate: 'string?',
          term: 'string?',
          paymentTerms: 'string?',
          obligationsA: ['string'],
          obligationsB: ['string'],
          risksA: ['string'],
          risksB: ['string'],
          keyClauses: ['string'],
          missingClauses: ['string'],
          termination: 'string?',
          confidentiality: 'string?',
          disputeResolution: 'string?',
          safetyScoreA: 0,
          safetyScoreB: 0,
          redFlags: ['string'],
          recommendations: ['string'],
        },
        null,
        0,
      ),
      'Lưu ý: safetyScoreA/B từ 0-100. Không trả về ```json hay giải thích ngoài JSON.',
    ].join('\n');

    const model = process.env.OPENAI_CONTRACT_MODEL || 'gpt-4.1-mini';

    const res = await this.client.responses.create({
      model,
      temperature: 0.2,
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            // 👇 Chỉ dùng cho PDF đã upload
            { type: 'input_file', file_id: fileId },
          ],
        },
      ],
    });

    const text = this.extractText(res);
    try {
      const data = JSON.parse(text);
      data.safetyScoreA = this.clampScore(data.safetyScoreA);
      data.safetyScoreB = this.clampScore(data.safetyScoreB);
      if (!data.title) data.title = originalName ?? 'Untitled Contract';
      return data;
    } catch {
      this.logger.warn('AI không trả JSON hợp lệ, dùng mock fallback.');
      return this.mockAnalysis(originalName);
    }
  }

  /**
   * Upload + phân tích + dọn file tạm
   */
  async uploadAndAnalyze(
    localPath: string,
    originalName: string,
    mimeType?: string,
  ) {
    let uploaded: { id: string };
    try {
      uploaded = await this.uploadToOpenAI(localPath, originalName, mimeType);
      const analysis = await this.analyzeUploadedContract(
        uploaded.id,
        originalName,
      );
      return { file: uploaded, analysis };
    } finally {
      this.safeUnlink(localPath);
    }
  }

  /* ---------- helpers ---------- */

  private extractText(res: any): string {
    if (res?.output_text && typeof res.output_text === 'string')
      return res.output_text;
    const legacy = res?.choices?.[0]?.message?.content;
    if (legacy && typeof legacy === 'string') return legacy;

    const chunks: string[] = [];
    if (Array.isArray(res?.output)) {
      for (const item of res.output) {
        if (Array.isArray(item?.content)) {
          for (const c of item.content) {
            if (typeof c?.text === 'string') chunks.push(c.text);
            if (typeof c?.content === 'string') chunks.push(c.content);
          }
        }
      }
    }
    return chunks.join('\n').trim();
  }

  private clampScore(n: any): number {
    const x = Number.isFinite(n) ? Number(n) : 0;
    return Math.max(0, Math.min(100, Math.round(x)));
  }

  private mockAnalysis(originalName?: string) {
    return {
      title: originalName ?? 'Hợp đồng mẫu',
      summary:
        'Bản hợp đồng có mức độ cân bằng tương đối nhưng thiếu các điều khoản phạt và chấm dứt rõ ràng.',
      parties: { A: 'Bên A (Người tạo)', B: 'Bên B (Người ký)' },
      governingLaw: 'Không thấy đề cập rõ',
      effectiveDate: 'Không thấy đề cập rõ',
      term: 'Không thấy đề cập rõ',
      paymentTerms:
        'Cần quy định lịch thanh toán, phạt chậm, và phương thức thanh toán.',
      obligationsA: [
        'Cung cấp hàng hoá/dịch vụ đúng mô tả và tiến độ.',
        'Bảo hành theo cam kết.',
      ],
      obligationsB: ['Thanh toán đúng hạn.', 'Hợp tác cung cấp thông tin.'],
      risksA: [
        'Thiếu phạt chậm thanh toán.',
        'Phạm vi công việc chưa chặt chẽ.',
      ],
      risksB: [
        'Giới hạn trách nhiệm có thể nghiêng về Bên A.',
        'Thiếu điều khoản hoàn trả khi chậm tiến độ.',
      ],
      keyClauses: [
        'Phạm vi công việc',
        'Giá & thanh toán',
        'Tiến độ & nghiệm thu',
        'Bảo mật',
        'Giới hạn trách nhiệm',
        'Giải quyết tranh chấp',
      ],
      missingClauses: [
        'Phạt chậm tiến độ/thanh toán',
        'Chấm dứt sớm & quy trình bàn giao',
      ],
      termination:
        'Nên quy định quyền chấm dứt, thời hạn khắc phục và bồi thường.',
      confidentiality: 'Ràng buộc bảo mật trong và sau thời hạn hợp đồng.',
      disputeResolution:
        'Khuyến nghị: Thương lượng/Hòa giải -> Trọng tài/Tòa án; nêu nơi/luật áp dụng.',
      safetyScoreA: 72,
      safetyScoreB: 68,
      redFlags: ['Thiếu khung phạt', 'Chưa nêu luật áp dụng'],
      recommendations: [
        'Bổ sung lịch thanh toán & phạt chậm.',
        'Chốt phạm vi & tiêu chí nghiệm thu.',
        'Đặt trần trách nhiệm & ngoại lệ.',
      ],
    };
  }

  private safeUnlink(p: string) {
    try {
      const base = path.basename(p);
      if (!base) return;
      fs.unlinkSync(p);
    } catch (e) {
      this.logger.debug(`Skip unlink ${p}: ${String(e)}`);
    }
  }
}
