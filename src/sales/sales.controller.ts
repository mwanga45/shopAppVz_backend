import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req } from '@nestjs/common';
import { SalesService } from './sales.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}



}
