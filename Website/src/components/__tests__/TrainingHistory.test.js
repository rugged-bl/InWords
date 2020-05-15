import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Route } from 'react-router-dom';
import mockFetch from 'src/test-utils/mockFetch';
import renderWithEnvironment from 'src/test-utils/renderWithEnvironment';
import TrainingHistory from 'src/components/routes/TrainingHistory';

const setup = () => {
  const accessData = {
    token: 'xyz',
    userId: 1
  };
  const mockingTrainingHistoryResponse = {
    levels: [
      {
        levelId: 1,
        stars: 3,
        isAvailable: true,
        gameType: 0
      }
    ]
  };
  global.fetch = mockFetch(mockingTrainingHistoryResponse);
  const route = '/training/history';
  const utils = renderWithEnvironment(
    <Route path="/training/history">
      <TrainingHistory />
    </Route>,
    {
      initialState: { auth: { token: accessData.token } },
      route
    }
  );

  const clickHistoryTraining = id =>
    fireEvent.click(utils.getByTestId(`to-level-${id}`));

  return {
    ...utils,
    mockingTrainingHistoryResponse,
    route,
    clickHistoryTraining
  };
};

test('select recent training', async () => {
  const utils = setup();
  const recentTrainingInfo = utils.mockingTrainingHistoryResponse.levels[0];
  await waitFor(() => screen.getByText(`${recentTrainingInfo.levelId}`));

  utils.clickHistoryTraining(recentTrainingInfo.levelId);

  expect(utils.history.location.pathname).toEqual(
    `${utils.route}/${recentTrainingInfo.levelId}`
  );
});
