import { User } from '../user/user.model';

export class Game {
  id: string;
  name: string;
  boardFen?: string;
  createdBy: User;

  playerWhite?: User;
  playerBlack?: User;
}
