import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDoc, UserEntity } from './entities/user.entity';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserEntity.name) private u: Model<UserDoc>,
    private readonly f: FilesService,
  ) {}
  async getUser(address: string) {
    const user = await this.u
      .findOne({ address: address.toLowerCase() })
      .lean();
    if (user) return user;
    return { address: address.toLowerCase(), isValid: false };
  }
  async kyc(createUserDto: { address: string; fileHash: string }) {
    const prompt = `
Analyze these ID card images and extract the following information:
1. Full name
2. ID number
3. Date of birth
5. Verify if this is a valid  ID card

Please respond in JSON format with these fields:
{
  "name": "extracted full name",
  "idNumber": "extracted ID number",
  "dateOfBirth": "extracted date of birth",
  "isValid": true/false,
  "country": "Country of the ID card",
  "confidence": "high/medium/low",
}
If the document is not a ID card or the images are unclear, set isValid to false and explain in notes.
        `;

    const file = await this.f.get(createUserDto.fileHash);
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:${file.contentType};base64,${file.dataBase64}`,
              },
            },
          ],
        },
      ],
    });
    const data = JSON.parse(response.choices[0].message.content);
    console.log('data', data);
    await this.u.findOneAndUpdate(
      { address: createUserDto.address.toLowerCase() },
      {
        address: createUserDto.address.toLowerCase(),
        isValid: data.isValid,
      },
      { upsert: true, new: true },
    );
    return { address: createUserDto.address.toLowerCase(), ...data };
  }
}
