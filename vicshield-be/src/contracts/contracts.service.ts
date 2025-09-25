import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { FilesService } from 'src/files/files.service';
import { ContractDoc, ContractEntity } from './entities/contract.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ContractsService {
  constructor(
    @InjectModel(ContractEntity.name) private ct: Model<ContractDoc>,
    readonly f: FilesService,
  ) {}

  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  getAll() {
    return this.ct.find().lean();
  }

  signContract(hash: string, address: string) {
    return this.ct
      .findOneAndUpdate({ hash }, { $addToSet: { signers: address } })
      .lean();
  }

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

  async syncContracts(hash: string) {
    const file = await this.f.getByHash(hash);
    const contract = await this.ct.findOne({ hash });

    const prompt = [
      'Bạn là một luật sư hợp đồng thương mại. Nhiệm vụ:',
      '- Đọc file hợp đồng PDF đính kèm.',
      '- Phân tích ngắn gọn, trung lập.',
      '- Chỉ trả về DUY NHẤT một JSON object theo schema.',
      '',
      'Schema JSON:',
      JSON.stringify(
        {
          title: 'string',
          description: 'string (<100 từ)',
          score:
            'number (0-100) độ an toàn hợp đồng. chấm điểm thật công tâm, trừ điểm dựa trên các rủi ro cho cả A và B, dựa trên các hợp đồng tương tự, trừ điểm khi thiếu các thông tin cần thiết, Rủi ro & điểm cần lưu ý',

          content:
            'markdown (Rủi ro & điểm cần lưu ý, mỗi ý rủi ro tự đánh giá priority cao/medium/low). ',
        },
        null,
        0,
      ),
      'Lưu ý: Không trả về ```json hay giải thích ngoài JSON.',
    ].join('\n');

    const res = await this.client.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            { type: 'input_file', file_id: file.openaiFileId },
          ],
        },
      ],
    });

    // @ts-ignore
    const text = this.extractText(res);

    const data = JSON.parse(text);
    contract.aiContent = data.content;
    contract.title = data.title;
    contract.description = data.description;
    contract.score = data.score;
    await contract.save();
    return contract;
  }

  async getContract(hash: string) {
    let contract = await this.ct.findOne({ hash });
    if (!contract?.hash) {
      contract = await this.ct.create({ hash });
    }
    if (contract.aiContent) return contract;
    return this.syncContracts(hash);
  }
}
