"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiBaseUrl = void 0;
const express_1 = __importDefault(require("express"));
require("./config/database");
const User_1 = __importDefault(require("./models/User"));
const Team_1 = __importDefault(require("./models/Team"));
const Activity_1 = __importDefault(require("./models/Activity"));
const Leaderboard_1 = __importDefault(require("./models/Leaderboard"));
const Workout_1 = __importDefault(require("./models/Workout"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 8000;
app.use(express_1.default.json());
const codespaceName = process.env.CODESPACE_NAME;
const getApiBaseUrl = () => {
    if (codespaceName) {
        return `https://${codespaceName}-8000.app.github.dev`;
    }
    return 'http://localhost:8000';
};
exports.getApiBaseUrl = getApiBaseUrl;
const buildCollectionResponse = (resource, items) => ({
    apiUrl: `${(0, exports.getApiBaseUrl)()}/api/${resource}/`,
    resource,
    count: items.length,
    results: items,
});
const createAsyncResourceRoutes = (Model, resource) => {
    const router = express_1.default.Router();
    router.get('/', async (_req, res) => {
        try {
            const items = await Model.find();
            res.json(buildCollectionResponse(resource, items));
        }
        catch (error) {
            res.status(500).json({ error: `Failed to fetch ${resource}` });
        }
    });
    router.post('/', async (req, res) => {
        try {
            const newItem = new Model(req.body);
            const savedItem = await newItem.save();
            res.status(201).json({
                message: `${resource} created successfully`,
                data: savedItem,
                apiUrl: `${(0, exports.getApiBaseUrl)()}/api/${resource}/`,
            });
        }
        catch (error) {
            res.status(400).json({ error: `Failed to create ${resource}`, details: error });
        }
    });
    router.get('/:id', async (req, res) => {
        try {
            const item = await Model.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ error: `${resource} not found` });
            }
            res.json(item);
        }
        catch (error) {
            res.status(500).json({ error: `Failed to fetch ${resource}` });
        }
    });
    router.put('/:id', async (req, res) => {
        try {
            const updatedItem = await Model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            if (!updatedItem) {
                return res.status(404).json({ error: `${resource} not found` });
            }
            res.json(updatedItem);
        }
        catch (error) {
            res.status(400).json({ error: `Failed to update ${resource}`, details: error });
        }
    });
    router.delete('/:id', async (req, res) => {
        try {
            const deletedItem = await Model.findByIdAndDelete(req.params.id);
            if (!deletedItem) {
                return res.status(404).json({ error: `${resource} not found` });
            }
            res.json({ message: `${resource} deleted successfully`, data: deletedItem });
        }
        catch (error) {
            res.status(500).json({ error: `Failed to delete ${resource}` });
        }
    });
    return router;
};
app.get('/', (_req, res) => {
    res.json({
        service: 'Octofit Tracker API',
        apiUrl: `${(0, exports.getApiBaseUrl)()}/api`,
        routes: ['/api/users/', '/api/teams/', '/api/activities/', '/api/leaderboard/', '/api/workouts/'],
    });
});
app.use('/api/users', createAsyncResourceRoutes(User_1.default, 'users'));
app.use('/api/teams', createAsyncResourceRoutes(Team_1.default, 'teams'));
app.use('/api/activities', createAsyncResourceRoutes(Activity_1.default, 'activities'));
app.use('/api/leaderboard', createAsyncResourceRoutes(Leaderboard_1.default, 'leaderboard'));
app.use('/api/workouts', createAsyncResourceRoutes(Workout_1.default, 'workouts'));
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Octofit Tracker API running on port ${PORT}`);
        console.log(`API base URL: ${(0, exports.getApiBaseUrl)()}`);
    });
}
exports.default = app;
//# sourceMappingURL=server.js.map