import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  pokemons:any[] = [];
  offset=0;
  limit=20;
  loading = false;
  searchTerm: string = '';
  searchedPokemon: any = null;
  searchError: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons(event?: any){
    if(this.loading && !event) return;
    this.loading = true;
    if (!event) {
        this.searchedPokemon = null;
        this.searchError = '';
    }
    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon?offset=${this.offset}&limit=${this.limit}`)
    .subscribe({
      next: (res)=>{
        this.pokemons = [...this.pokemons, ...res.results];
        this.offset += this.limit;
        if(event){
          event.target.complete();
        }
        if(res.next === null && event){
          event.target.disabled = true;
        }
      },
      error: (err) => {
        console.error('Error cargando pokémons:', err);
        if (event) {
          event.target.complete();
        }
        this.loading = false; // Asegúrate de que loading se ponga en false en caso de error
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getImageUrl(pokemon: any) {
    if (pokemon && pokemon.url) {
      const parts = pokemon.url.split('/');
      const id = parts[parts.length - 2];
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    }
    if (pokemon && pokemon.sprites && pokemon.sprites.front_default) { // Para el Pokémon buscado directamente
         return pokemon.sprites.front_default;
    }
    if (pokemon && pokemon.id) { // Fallback si no hay sprites.front_default pero sí ID
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
    }
    return 'assets/icon/favicon.png';
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    if (!this.searchTerm.trim()) { // Usar trim para evitar búsquedas vacías con espacios
      this.clearSearchAndReload();
    }
  }

  async searchPokemon() {
    if (!this.searchTerm.trim()) {
      this.searchedPokemon = null;
      this.searchError = 'Por favor, introduce un nombre o ID de Pokémon.';
      // No necesariamente recargar toda la lista aquí, podría ser confuso.
      // Considera solo limpiar el resultado de la búsqueda.
      // Si quieres recargar:
      // this.clearSearchAndReload();
      return;
    }
    this.loading = true;
    this.searchedPokemon = null;
    this.searchError = '';
    this.pokemons = []; // Limpia la lista de pokemons mientras se busca

    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${this.searchTerm.toLowerCase().trim()}`)
      .subscribe({
        next: (res) => {
          this.searchedPokemon = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error buscando el pokémon:', err);
          this.searchedPokemon = null;
          if (err.status === 404) {
            this.searchError = `Pokémon "${this.searchTerm.trim()}" no encontrado.`;
          } else {
            this.searchError = 'Error al buscar el Pokémon. Inténtalo de nuevo.';
          }
          this.loading = false;
        }
      });
  }

  goToPokemonDetail(pokemonName: string) {
    if (!pokemonName) return;

    // Quitar el foco del elemento activo para ayudar con el error aria-hidden
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    this.router.navigate(['/pokemon-detail', pokemonName.toLowerCase()]);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchedPokemon = null;
    this.searchError = '';
    // No recargar automáticamente aquí, el usuario podría querer ver la lista que ya estaba.
    // Si se borra desde el input (ionClear), onSearchChange maneja la recarga si es necesario.
  }

  // Método para limpiar búsqueda y recargar lista inicial
  clearSearchAndReload() {
    this.searchTerm = '';
    this.searchedPokemon = null;
    this.searchError = '';
    this.pokemons = [];
    this.offset = 0;
    this.loadPokemons();
  }
}