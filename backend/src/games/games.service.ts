import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GamesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getPopularGames() {
    const apiKey = this.configService.getOrThrow<string>('RAWG_API_KEY');

    const baseUrl = this.configService.getOrThrow<string>('RAWG_BASE_URL');

    const response = await firstValueFrom(
      this.httpService.get(`${baseUrl}/games`, {
        params: {
          key: apiKey,
          ordering: '-rating',
          page_size: 20,
        },
      }),
    );

    return response.data;
  }

  async searchGames(query: string) {
    const apiKey = this.configService.getOrThrow<string>('RAWG_API_KEY');

    const baseUrl = this.configService.getOrThrow<string>('RAWG_BASE_URL');

    const response = await firstValueFrom(
      this.httpService.get(`${baseUrl}/games`, {
        params: {
          key: apiKey,
          search: query,
          page_size: 20,
        },
      }),
    );

    return response.data;
  }

  async searchFirstGame(query: string) {
    const data = await this.searchGames(query);

    const game = data.results?.[0];

    if (!game) {
      return null;
    }

    return {
      id: game.id,
      slug: game.slug,
      name: game.name,
      rating: game.rating,
      released: game.released,
      imageUrl: game.background_image,
      rawgUrl: `https://rawg.io/games/${game.slug}`,
      platforms:
        game.parent_platforms?.map((item) => item.platform.name).join(', ') ??
        'Sin plataformas',
      genres:
        game.genres?.map((genre) => genre.name).join(', ') ?? 'Sin géneros',
    };
  }
}
