import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import gameActions from '../../actions/gameActions';
import gameApiActions from '../../actions/gameApiActions';
import FinalScreen from './FinalScreen';
import { AppBarContext } from '../TopAppBar/AppBarContext';
import UpwardButton from '../shared/UpwardButton';
import GameField from './GameField';
import withActualGameLevel from './withActualGameLevel';

const shuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
};

function GameFieldContainer({ gameLevel, resetGameLevelScore, saveLevelResult }) {
    const [infoAboutRandomWords, setInfoAboutRandomWords] = React.useState([]);
    const [infoAboutSelectedWords, setInfoAboutSelectedWords] = React.useState([]);
    const [successfulPairIds, setSuccessfulPairIds] = React.useState([]);
    const [successfulSelectedPairId, setSuccessfulSelectedPairId] = React.useState(-1);
    const [closuresQuantity, setClosuresQuantity] = React.useState(0);
    const [gameCompleted, setGameCompleted] = React.useState(false);

    const { resetAppBar } = React.useContext(AppBarContext);

    React.useEffect(() => {
        resetAppBar({
            title: 'Уровень',
            leftElement: <UpwardButton />
        });

        resetGameLevelScore();

        const shuffledWordTranslations = shuffle([...gameLevel.wordTranslations]);
        const infoAboutWords = [].concat.apply([], shuffledWordTranslations.slice(0, 8).map(wordPair =>
            [{
                pairId: wordPair.serverId,
                word: wordPair.wordForeign
            }, {
                pairId: wordPair.serverId,
                word: wordPair.wordNative
            }]
        ));

        setInfoAboutRandomWords(shuffle(infoAboutWords));
    }, []);

    React.useEffect(() => {
        if (successfulPairIds.length > 0 && successfulPairIds.length === infoAboutRandomWords.length / 2) {
            saveLevelResult({
                levelId: gameLevel.levelId,
                openingQuantity: closuresQuantity * 2 + infoAboutRandomWords.length,
                wordsCount: infoAboutRandomWords.length
            });

            setTimeout(() => {
                setGameCompleted(true);
            }, 500);
        }
    }, [successfulPairIds]);

    const handleClick = (pairId, wordId) => () => {
        if (successfulPairIds.find(successfulPairId => successfulPairId === pairId)) {
            setSuccessfulSelectedPairId(pairId);
            return;
        }

        if (infoAboutSelectedWords.length === 2 ||
            infoAboutSelectedWords.find(selectedWordInfo => selectedWordInfo.wordId === wordId)) {
            return;
        }

        if (infoAboutSelectedWords.length < 2) {
            setInfoAboutSelectedWords(infoAboutSelectedWords.concat({
                pairId: pairId,
                wordId: wordId
            }));
        }

        if (infoAboutSelectedWords.length > 0) {
            if (infoAboutSelectedWords.find(selectedWordInfo => selectedWordInfo.pairId === pairId) &&
                !successfulPairIds.find(successfulPairId => successfulPairId === pairId)) {
                setInfoAboutSelectedWords([]);
                setSuccessfulPairIds([...successfulPairIds, pairId]);
                setSuccessfulSelectedPairId(pairId);
            } else {
                setTimeout(() => {
                    setInfoAboutSelectedWords([]);
                    setClosuresQuantity(closuresQuantity + 1);
                }, 700);
            }
        }
    };

    const handleReplay = () => {
        setInfoAboutSelectedWords([]);
        setSuccessfulPairIds([]);
        setSuccessfulSelectedPairId(-1);
        setClosuresQuantity(0);
        setGameCompleted(false);

        resetGameLevelScore();

        setInfoAboutRandomWords(shuffle([...infoAboutRandomWords]));
    };

    return (
        <GameField
            infoAboutRandomWords={infoAboutRandomWords}
            infoAboutSelectedWords={infoAboutSelectedWords}
            successfulPairIds={successfulPairIds}
            successfulSelectedPairId={successfulSelectedPairId}
            handleClick={handleClick}
            gameCompleted={gameCompleted}
            finalScreen={<FinalScreen handleReplay={handleReplay} />}
        />
    );
}

GameFieldContainer.propTypes = {
    gameLevel: PropTypes.shape({
        levelId: PropTypes.number,
        wordTranslations: PropTypes.arrayOf(PropTypes.shape({
            serverId: PropTypes.number.isRequired,
            wordForeign: PropTypes.string.isRequired,
            wordNative: PropTypes.string.isRequired
        })).isRequired
    }).isRequired,
    resetGameLevelScore: PropTypes.func.isRequired,
    saveLevelResult: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => {
    return {
        resetGameLevelScore: () => dispatch(gameActions.resetGameLevelScore()),
        saveLevelResult: levelResult => dispatch(gameApiActions.saveLevelResult(levelResult))
    };
};

export default connect(
    null,
    mapDispatchToProps
)(withActualGameLevel(GameFieldContainer));