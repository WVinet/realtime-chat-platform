import { Controller, Get, Query } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('popular')
  getPopularGames() {
    return this.gamesService.getPopularGames();
  }

  @Get('search')
  searchGames(
    @Query('query') query: string,
    @Query('platform') platform?: string,
    @Query('genre') genre?: string,
  ) {
    return this.gamesService.searchGames(query, platform, genre);
  }
}
