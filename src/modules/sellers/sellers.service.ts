import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GlobalData } from '../auth/guards/global-data';
import { Seller } from './models/sellers.model';
import { SellerCreateDto } from './dto/seller-create.dto';
import { SellerUpdateDto } from './dto/seller-update.dto';
import { ExpertsService } from '../experts/experts.service';
import { Expert } from '../experts/models/experts.model';
import { ExpertTranslation } from '../experts/models/experts-translations.model';

@Injectable()
export class SellersService {
  constructor(
    @InjectModel(Seller) private sellerRepository: typeof Seller,
    private expertService: ExpertsService,
  ) {}

  public async getAll(): Promise<Seller[]> {
    return await this.sellerRepository.findAll({
      where: { project_id: AuthGuard.projectId },
      include: [
        {
          model: Expert,
          include: [
            {
              model: ExpertTranslation,
              where: { lang_id: GlobalData.langId },
            },
          ],
        },
      ],
    });
  }

  public async findById(id: number): Promise<Seller> {
    const seller = await this.sellerRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id: id },
      include: [
        {
          model: Expert,
          required: false,
          include: [
            {
              model: ExpertTranslation,
              where: { lang_id: GlobalData.langId },
            },
          ],
        },
      ],
    });
    if (!seller) {
      throw new HttpException('Seller was not found.', HttpStatus.BAD_REQUEST);
    }
    return seller;
  }

  public async findByExpertId(id: number): Promise<Seller> {
    const seller = await this.sellerRepository.findOne({
      rejectOnEmpty: undefined,
      where: { expert_id: id },
      include: [
        {
          model: Expert,
          required: false,
          include: [
            {
              model: ExpertTranslation,
              where: { lang_id: GlobalData.langId },
            },
          ],
        },
      ],
    });
    if (!seller) {
      throw new HttpException('Seller was not found.', HttpStatus.BAD_REQUEST);
    }
    return seller;
  }

  public async store(sellerDto: SellerCreateDto): Promise<Seller> {
    const seller = await this.sellerRepository.create({
      ...sellerDto,
      project_id: Number(AuthGuard.projectId),
    });

    return await this.findById(seller.id);
  }

  public async update(id: number, sellerDto: SellerUpdateDto): Promise<Seller> {
    await this.sellerRepository.update(sellerDto, {
      returning: undefined,
      where: { id, project_id: AuthGuard.projectId },
    });
    return await this.findById(id);
  }

  public async destroy(id: number): Promise<number> {
    await this.findById(id);
    return await this.sellerRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  public async findSellerByExpertId(expertId: number): Promise<Seller[]> {
    await this.expertService.findById(expertId);

    return await this.sellerRepository.findAll({
      order: [['id', 'DESC']],
      where: { expert_id: expertId, project_id: AuthGuard.projectId },
      include: [
        {
          model: Expert,
          include: [
            {
              model: ExpertTranslation,
              where: { lang_id: GlobalData.langId },
            },
          ],
        },
      ],
    });
  }
}
