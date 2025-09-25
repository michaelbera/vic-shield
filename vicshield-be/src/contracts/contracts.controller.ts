import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ContractsService } from './contracts.service';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get(':hash')
  getContract(@Param('hash') hash: string) {
    return this.contractsService.getContract(hash);
  }

  @Post(':hash/sign')
  signContract(@Param('hash') hash: string, @Body() body: { signer: string }) {
    return this.contractsService.signContract(hash, body.signer);
  }

  @Get()
  getAll() {
    return this.contractsService.getAll();
  }
}
