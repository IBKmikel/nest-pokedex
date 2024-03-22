import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  constructor(
    @InjectModel( Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){
  }

  async executeSeed(){
    await this.pokemonModel.deleteMany({});
    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=15');

    const insertPromisesArrar = [];

    data.results.forEach(({name, url})=>{
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      // const pokemon = await this.PokemonModel.create({name, no});
      insertPromisesArrar.push(
        this.pokemonModel.create({name, no})
      );
    });


    await Promise.all(insertPromisesArrar);

    return 'Seed executed';
  }
}
