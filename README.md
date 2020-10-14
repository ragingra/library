# Library Project

## Setup
- Set backend url environment variable:

```export REACT_APP_BACKEND_SERVICE_URL=http://api.localhost```

- Build and run docker containers in detached mode 

```docker-compose up -d --build```

- Create or create DB: 

```docker-compose exec server python manage.py recreate_db```


Frontend: localhost

Backend: api.localhost


## Optional
- Seed DB

```docker-compose exec server python manage.py seed_db```

- Run Flake8 on python code

```docker-compose exec -T server flake8 --ignore=E501 project```

- Run python unit tests

```docker-compose exec -T server python manage.py test```

- E2E Tests - Cypress

From root directory, install dependencies npm install

```Open Cypress ./node_modules/.bin/cypress open```






