import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GameActions } from '../actions/GameActions';

class GamePackAdding extends Component {
    static propTypes = {
        gamesInfo: PropTypes.array.isRequired,
        addGamePack: PropTypes.func.isRequired,
        handleCancel: PropTypes.func.isRequired
    };

    state = {
        descriptions: [{
            langId: 1,
            title: "",
            description: ""
        }],
        levelPacks: [{
            level: 1,
            wordTranslations: [{
                wordForeign: "",
                wordNative: ""
            }]
        }]
    };

    componentDidUpdate(prevProps) {
        if (this.props.gamesInfo !== prevProps.gamesInfo) {
            this.props.handleCancel();
        }
    }

    handleChangeDescriptions = (sourceIndex, propertyName) => (event) => {
        const newDescriptions = this.state.descriptions.map((description, destinationIndex) => {
            if (sourceIndex !== destinationIndex) {
                return description;
            };

            return { ...description, [propertyName]: event.target.value };
        });

        this.setState({
            descriptions: newDescriptions
        });
    };

    handleAddDescription = () => {
        this.setState({
            descriptions: this.state.descriptions.concat({
                langId: this.state.descriptions.length + 1, title: "", description: ""
            })
        });
    };

    handleDelDescription = () => {
        this.setState({
            descriptions: this.state.descriptions.slice(0, -1)
        });
    };

    handleAddLevelPack = () => {
        this.setState({
            levelPacks: this.state.levelPacks.concat({
                level: this.state.levelPacks.length + 1,
                wordTranslations: [{ wordForeign: "", wordNative: "" }]
            })
        });
    };

    handleDelLevelPack = () => {
        this.setState({
            levelPacks: this.state.levelPacks.slice(0, -1)
        });
    };

    handleChangeWordTranslations = (sourceLevelPackIndex, sourceWordTranslationIndex, propertyName) => (event) => {
        const newLevelPacks = this.state.levelPacks.map((levelPack, destinationLevelPackIndex) => {
            if (sourceLevelPackIndex !== destinationLevelPackIndex) {
                return levelPack;
            };

            const newWordTranslations = levelPack.wordTranslations.map((wordTranslation, destinationWordTranslationIndex) => {
                if (sourceWordTranslationIndex !== destinationWordTranslationIndex) {
                    return wordTranslation;
                };

                return {
                    ...wordTranslation,
                    [propertyName]: event.target.value
                };
            });

            return {
                ...levelPack,
                wordTranslations: newWordTranslations
            };
        });

        this.setState({
            levelPacks: newLevelPacks
        });
    };

    handleAddWordTranslation = (sourceIndex) => {
        const newLevelPacks = this.state.levelPacks.map((levelPack, destinationIndex) => {
            if (sourceIndex !== destinationIndex) {
                return levelPack;
            };

            return {
                ...levelPack, wordTranslations: levelPack.wordTranslations.concat({
                    wordForeign: "",
                    wordNative: ""
                })
            };
        });

        this.setState({
            levelPacks: newLevelPacks
        });
    };

    handleDelWordTranslation = (sourceIndex) => {
        const newLevelPacks = this.state.levelPacks.map((levelPack, destinationIndex) => {
            if (sourceIndex !== destinationIndex) {
                return levelPack;
            };

            return {
                ...levelPack,
                wordTranslations: levelPack.wordTranslations.slice(0, -1)
            };
        });

        this.setState({
            levelPacks: newLevelPacks
        });
    };

    handleSubmit = (event) => {
        this.props.addGamePack({
            CreationInfo: {
                Descriptions: this.state.descriptions.map((description) => {
                    return {
                        LangID: description.langId,
                        Title: description.title,
                        Description: description.description
                    }
                })
            },
            LevelPacks: this.state.levelPacks.map((levelPack) => {
                return {
                    Level: levelPack.level,
                    WordTranslations: levelPack.wordTranslations.map((wordTranslation) => {
                        return {
                            WordForeign: wordTranslation.wordForeign,
                            WordNative: wordTranslation.wordNative
                        }
                    })
                }
            })
        });

        event.preventDefault();
    };

    render() {
        const { handleCancel } = this.props;
        const { descriptions, levelPacks } = this.state;

        return (
            <form onSubmit={this.handleSubmit}>
                <ul className="list-group">
                    {descriptions.map((description, index) =>
                        <li className="list-group-item mb-3" key={index}>
                            <h5 className="font-weight-bold">Описание {index + 1}</h5>
                            <input type="text" className="form-control form-control-sm mb-2" required="required" placeholder="Название"
                                value={description.title} onChange={this.handleChangeDescriptions(index, "title")} />
                            <textarea className="form-control form-control-sm" placeholder="Описание"
                                value={description.description} onChange={this.handleChangeDescriptions(index, "description")} />
                        </li>
                    )}
                </ul>
                <div className="btn-group btn-group-sm mb-3" role="group">
                    <button type="button" className="btn btn-outline-primary"
                        onClick={this.handleAddDescription}>Добавить описание</button>
                    {descriptions.length > 1 ?
                        <button type="button" className="btn btn-outline-primary"
                            onClick={this.handleDelDescription}>Удалить описание</button>
                        : <Fragment />}
                </div>
                <ul className="list-group">
                    {levelPacks.map((levelPack, levelPackIndex) =>
                        <li className="list-group-item mb-3" key={levelPackIndex}>
                            <h5 className="font-weight-bold">Уровень {levelPackIndex + 1}</h5>
                            {levelPack.wordTranslations.map((wordTranslation, wordTranslationIndex) =>
                                <div className="input-group input-group-sm mb-2" key={wordTranslationIndex}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">{wordTranslationIndex + 1}</span>
                                    </div>
                                    <input type="text" className="form-control" required="required" placeholder="Слово или фраза"
                                        value={wordTranslation.wordForeign} onChange={this.handleChangeWordTranslations(levelPackIndex, wordTranslationIndex, "wordForeign")} />
                                    <input type="text" className="form-control" required="required" placeholder="Перевод"
                                        value={wordTranslation.wordNative} onChange={this.handleChangeWordTranslations(levelPackIndex, wordTranslationIndex, "wordNative")} />
                                </div>
                            )}
                            <div className="btn-group btn-group-sm" role="group">
                                <button type="button" className="btn btn-outline-primary"
                                    onClick={() => this.handleAddWordTranslation(levelPackIndex)}>Добавить пару слов</button>
                                {levelPacks[levelPackIndex].wordTranslations.length > 1 ?
                                    <button type="button" className="btn btn-outline-primary"
                                        onClick={() => this.handleDelWordTranslation(levelPackIndex)}>Удалить пару слов</button>
                                    : <Fragment />}
                            </div>
                        </li>
                    )}
                </ul>
                <div className="btn-group btn-group-sm mb-3" role="group">
                    <button type="button" className="btn btn-outline-primary"
                        onClick={this.handleAddLevelPack}>Добавить уровень</button>
                    {levelPacks.length > 1 ?
                        <button type="button" className="btn btn-outline-primary"
                            onClick={this.handleDelLevelPack}>Удалить уровень</button>
                        : <Fragment />}
                </div>
                <br />
                <div className="btn-group" role="group">
                    <button type="submit" className="btn btn-primary">Сохранить</button>
                    <button type="button" className="btn btn-outline-primary"
                        onClick={handleCancel}>Отменить</button>
                </div>
            </form>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        gamesInfo: store.game.gamesInfo,
        userInfo: store.user.userInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addGamePack: (gamePack) => dispatch(GameActions.addGamePack(gamePack))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GamePackAdding);
