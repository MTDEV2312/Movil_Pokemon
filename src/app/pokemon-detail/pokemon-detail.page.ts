import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.page.html',
  styleUrls: ['./pokemon-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class PokemonDetailPage implements OnInit {
  pokemonName: string | null = null;
  pokemonDetails: any = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.pokemonName = this.route.snapshot.paramMap.get('name');
    if (this.pokemonName) {
      this.loadPokemonDetails(this.pokemonName);
    } else {
      this.error = 'No se pudo obtener el nombre del Pokémon de la ruta.';
      this.isLoading = false;
    }
  }

  loadPokemonDetails(name: string) {
    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
      .subscribe({
        next: (data) => {
          this.pokemonDetails = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching pokemon details:', err);
          this.error = `No se pudieron cargar los detalles para ${this.capitalizeFirstLetter(name)}.`;
          if (err.status === 404) {
            this.error = `Pokémon "${this.capitalizeFirstLetter(name)}" no encontrado.`;
          }
          this.isLoading = false;
        }
      });
  }

  getSpriteUrl(pokemon: any): string {
    if (pokemon && pokemon.sprites && pokemon.sprites.front_default) {
      return pokemon.sprites.front_default;
    }
    return 'assets/icon/favicon.png';
  }

  capitalizeFirstLetter(string: string | null | undefined): string {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
