import React from 'react';
import { fireEvent, wait } from '@testing-library/react';
import mockFetch from 'src/test-utils/mockFetch';
import renderWithEnvironment from 'src/test-utils/renderWithEnvironment';
import SignUp from 'src/components/routes/SignUp';

const setup = () => {
  const mockingAccessResponse = { token: 'xyz', userId: 1 };
  const userData = { email: '1@1', password: '1' };
  global.fetch = mockFetch(mockingAccessResponse);
  const utils = renderWithEnvironment(<SignUp />);
  const changeEmailInput = value =>
    fireEvent.change(utils.getByLabelText('Email'), { target: { value } });
  const changePasswordInput = value =>
    fireEvent.change(utils.getByLabelText('Пароль'), { target: { value } });
  const clickSubmit = () =>
    fireEvent.click(utils.getByText('Зарегистрироваться'));
  const clickSubmitAsGuest = () =>
    fireEvent.click(utils.getByText('Войти гостем'));

  return {
    ...utils,
    userData,
    mockingAccessResponse,
    changeEmailInput,
    changePasswordInput,
    clickSubmit,
    clickSubmitAsGuest
  };
};

test('sign up successfully', async () => {
  const utils = setup();
  utils.changeEmailInput(utils.userData.email);
  utils.changePasswordInput(utils.userData.password);
  utils.clickSubmit();

  await wait(() => {
    expect(JSON.parse(window.localStorage.getItem('state'))).toMatchObject({
      access: utils.mockingAccessResponse
    });
  });
});

test('sign up as guest successfully', async () => {
  const utils = setup();
  utils.clickSubmitAsGuest();

  await wait(() => {
    expect(JSON.parse(window.localStorage.getItem('state'))).toMatchObject({
      access: utils.mockingAccessResponse
    });
  });
});
