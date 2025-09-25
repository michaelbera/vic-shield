import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { FilesModule } from 'src/files/files.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractEntity, ContractSchema } from './entities/contract.entity';

@Module({
  imports: [
    FilesModule,
    MongooseModule.forFeature([
      { name: ContractEntity.name, schema: ContractSchema },
    ]),
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
