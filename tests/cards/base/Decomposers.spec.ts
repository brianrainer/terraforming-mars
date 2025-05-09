import {expect} from 'chai';
import {Algae} from '../../../src/server/cards/base/Algae';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {EcologyExperts} from '../../../src/server/cards/prelude/EcologyExperts';
import {IGame} from '../../../src/server/IGame';
import {Phase} from '../../../src/common/Phase';
import {TestPlayer} from '../../TestPlayer';
import {setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Decomposers', () => {
  let card: Decomposers;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Decomposers();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setOxygenLevel(game, 3);
    expect(card.canPlay(player)).is.true;
    card.play(player);

    card.onCardPlayed(player, new Birds());
    expect(card.resourceCount).to.eq(1);
    card.onCardPlayed(player, card);
    expect(card.resourceCount).to.eq(2);
    card.onCardPlayed(player, new Algae());

    expect(card.resourceCount).to.eq(3);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });

  it('Should get triggered by EcoExperts if played together', () => {
    const ecoExpertCard = new EcologyExperts();
    game.phase = Phase.PRELUDES;
    player.playCard(ecoExpertCard);
    expect(card.canPlay(player)).is.true;
    player.playCard(card);
    expect(card.resourceCount).to.eq(3);
  });
});
