const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para buscar vagas com paginação
app.get('/search_jobs', async (req, res) => {
  const query = req.query.query || 'react'; // Termo de busca (valor padrão: 'react')
  const location = req.query.location || 'Brazil'; // Localização (valor padrão: 'Brazil')
  const remoteOnly = 'true'; // Sempre busca apenas vagas remotas
  const employmentTypes = req.query.employmentTypes || 'fulltime;parttime;intern;contractor'; // Tipos de emprego
  const maxResults = parseInt(req.query.maxResults, 10) || 100; // Número máximo de resultados desejados
  const resultsPerPage = 20; // Limite de resultados por página da API
  const apiKey = '4017687f0amshdef8fc97685b30cp1e1c65jsnbeda4fdb4ce2'; // Substitua pela sua chave de API

  let allJobs = [];
  let page = 1;

  try {
    while (allJobs.length < maxResults) {
      const options = {
        method: 'GET',
        url: 'https://jobs-api14.p.rapidapi.com/v2/list',
        params: {
          query,
          location,
          autoTranslateLocation: 'true',
          remoteOnly,
          employmentTypes,
          page,
        },
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'jobs-api14.p.rapidapi.com',
        },
      };

      const response = await axios.request(options);
      const jobs = response.data.jobs || [];

      if (jobs.length === 0) {
        break; // Se não houver mais resultados, interrompe a busca
      }

      allJobs = allJobs.concat(jobs);
      page += 1;

      // Evita exceder o limite de resultados
      if (allJobs.length >= maxResults) {
        allJobs = allJobs.slice(0, maxResults);
        break;
      }
    }

    res.json({ jobs_data: JSON.stringify(allJobs) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inicializar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
