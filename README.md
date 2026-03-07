# Moba

Pannello di amministrazione moderno per Rails, costruito con React, TypeScript e [Superglue](https://thoughtbot.github.io/superglue/).

## Requisiti

- Ruby >= 3.1
- Rails >= 7.0
- Node.js >= 22

## Installazione

Aggiungi la gem al `Gemfile` della tua applicazione Rails:

```ruby
gem "moba", github: "lcastelnovo/moba"
```

Installa le dipendenze:

```bash
bundle install
```

Monta l'engine nel file `config/routes.rb`:

```ruby
Rails.application.routes.draw do
  mount Moba::Engine => "/admin"
end
```

## Configurazione

Puoi personalizzare Moba con un initializer (es. `config/initializers/moba.rb`):

```ruby
Moba.configure do |config|
  config.namespace = "admin"
  config.mount_path = "/admin"
  config.current_user_method = :current_user
end
```

| Opzione | Default | Descrizione |
|---------|---------|-------------|
| `namespace` | `"admin"` | Namespace usato nelle URL |
| `mount_path` | `"/admin"` | Percorso di mount dell'engine |
| `current_user_method` | `:current_user` | Metodo per ottenere l'utente corrente |

## Creare una risorsa

Crea un file in `app/moba/resources/` per ogni modello che vuoi gestire. Esempio per il modello `User`:

```ruby
# app/moba/resources/user_resource.rb

class UserResource < Moba::Resource
  self.model_class = "User"

  field :first_name, type: :text, required: true
  field :last_name, type: :text, required: true
  field :email, type: :email, required: true
  field :role, type: :select, options: %w[user admin manager]
end

Moba.register_resource(UserResource)
```

Tipi di campo disponibili: `:text`, `:email`, `:select`.

## Build degli asset

Compila JavaScript e CSS:

```bash
npm run build
```

In fase di sviluppo, usa la modalita' watch per ricompilare automaticamente:

```bash
npm run watch
```

## Avviare il server

```bash
bin/rails s
```

Naviga a [http://localhost:3000/admin](http://localhost:3000/admin) per accedere al pannello.

## Sviluppo

```bash
# Setup iniziale
bin/setup

# Eseguire i test
bundle exec rspec

# Console interattiva
bin/console

# Watch mode per gli asset
npm run watch
```

## Licenza

Distribuito con licenza [MIT](https://opensource.org/licenses/MIT).
