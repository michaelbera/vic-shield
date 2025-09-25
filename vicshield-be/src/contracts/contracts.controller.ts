import { Controller, Get, Param } from '@nestjs/common';
import { ContractsService } from './contracts.service';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get(':hash')
  getContract(@Param('hash') hash: string) {
    return this.contractsService.getContract(hash);
  }
}
