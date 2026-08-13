import express, { Request, Response } from 'express';
import './config/database';
import User from './models/User';
import Team from './models/Team';
import Activity from './models/Activity';
import Leaderboard from './models/Leaderboard';
import Workout from './models/Workout';

const app = express();
const PORT = Number(process.env.PORT) || 8000;

app.use(express.json());

const codespaceName = process.env.CODESPACE_NAME;

export const getApiBaseUrl = (): string => {
  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  return 'http://localhost:8000';
};

const buildCollectionResponse = (resource: string, items: unknown[]) => ({
  apiUrl: `${getApiBaseUrl()}/api/${resource}/`,
  resource,
  count: items.length,
  results: items,
});

const createAsyncResourceRoutes = (Model: any, resource: string) => {
  const router = express.Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const items = await Model.find();
      res.json(buildCollectionResponse(resource, items));
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch ${resource}` });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const newItem = new Model(req.body);
      const savedItem = await newItem.save();

      res.status(201).json({
        message: `${resource} created successfully`,
        data: savedItem,
        apiUrl: `${getApiBaseUrl()}/api/${resource}/`,
      });
    } catch (error) {
      res.status(400).json({ error: `Failed to create ${resource}`, details: error });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: `${resource} not found` });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch ${resource}` });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const updatedItem = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!updatedItem) {
        return res.status(404).json({ error: `${resource} not found` });
      }
      res.json(updatedItem);
    } catch (error) {
      res.status(400).json({ error: `Failed to update ${resource}`, details: error });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const deletedItem = await Model.findByIdAndDelete(req.params.id);
      if (!deletedItem) {
        return res.status(404).json({ error: `${resource} not found` });
      }
      res.json({ message: `${resource} deleted successfully`, data: deletedItem });
    } catch (error) {
      res.status(500).json({ error: `Failed to delete ${resource}` });
    }
  });

  return router;
};

app.get('/', (_req: Request, res: Response) => {
  res.json({
    service: 'Octofit Tracker API',
    apiUrl: `${getApiBaseUrl()}/api`,
    routes: ['/api/users/', '/api/teams/', '/api/activities/', '/api/leaderboard/', '/api/workouts/'],
  });
});

app.use('/api/users', createAsyncResourceRoutes(User, 'users'));
app.use('/api/teams', createAsyncResourceRoutes(Team, 'teams'));
app.use('/api/activities', createAsyncResourceRoutes(Activity, 'activities'));
app.use('/api/leaderboard', createAsyncResourceRoutes(Leaderboard, 'leaderboard'));
app.use('/api/workouts', createAsyncResourceRoutes(Workout, 'workouts'));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Octofit Tracker API running on port ${PORT}`);
    console.log(`API base URL: ${getApiBaseUrl()}`);
  });
}

export default app;
