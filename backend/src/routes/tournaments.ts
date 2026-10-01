import { Router } from 'express';
import { getTournaments } from '../controllers/tournamentController';

const router = Router();

router.get('/', getTournaments);

export default router;
