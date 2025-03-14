import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

beforeEach(() => {
    render(<IletisimFormu />);
  });

test('hata olmadan render ediliyor', () => {
    render(<IletisimFormu />);
});

test('iletişim formu headerı render ediliyor', () => {
  const titleh1 = screen.getByText('İletişim Formu');
  expect(titleh1).toBeInTheDocument();
  expect(titleh1).toBeTruthy();
  expect(titleh1).toHaveTextContent('İletişim Formu');
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
  const nameInput = screen.getByLabelText('Ad*');
  const surnameInput = screen.getByTestId('lastName-input');
  const emailInput = screen.getByTestId('email-input');
  const submitButton = screen.getByTestId('submit-button');

  await userEvent.type(surnameInput, 'Yılmaz');
  await userEvent.type(emailInput, 'test@example.com');
  await userEvent.click(submitButton);

  const errorMessages = await screen.findAllByTestId('error');
  expect(errorMessages).toHaveLength(1);
  expect(errorMessages[0]).toHaveTextContent(
    'Hata: ad en az 5 karakter olmalıdır'
  );
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    const button = screen.getByRole('button');
    await userEvent.click(button);

    await waitFor(() => {
    const errorMessages = screen.getAllByTestId('error');
    expect(errorMessages).toHaveLength(3);
  });

});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    const name = screen.getByTestId('name-input');
    const surname = screen.getByTestId('lastName-input');
    const submitButton = screen.getByTestId('submit-button');

    await userEvent.type(name, 'Ahmet');
    await userEvent.type(surname, 'Yılmaz');
    await userEvent.click(submitButton);

    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);

});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByTestId('submit-button');

    await userEvent.type(emailInput, 'gecersizmail');
    await userEvent.click(submitButton);

    const errorMessages = await screen.findAllByTestId('error');
    const emailError = errorMessages.find((msg) =>
    msg.textContent.includes('email geçerli bir email adresi olmalıdır')
  );
    expect(emailError).toBeInTheDocument();
    expect(emailError).toHaveTextContent(
    'Hata: email geçerli bir email adresi olmalıdır.'
  );
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    const name = screen.getByTestId('name-input');
    const submitButton = screen.getByText('Gönder');

    await userEvent.type(name, 'Ahmet');
    await userEvent.click(submitButton);

    const errorMessage = await screen.findByText('Hata: soyad gereklidir.');
    expect(errorMessage).toBeInTheDocument();
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    const name = screen.getByTestId('name-input');
    const surname = screen.getByTestId('lastName-input');
    const email = screen.getByTestId('email-input');
    const submitButton = screen.getByTestId('submit-button');

    await userEvent.type(name, 'Ahmet');
    await userEvent.type(surname, 'Yılmaz');
    await userEvent.type(email, 'ahmet@example.com');
    await userEvent.click(submitButton);

    await waitFor(() => {
    const errorMessages = screen.queryAllByTestId('error');
    expect(errorMessages).toHaveLength(0);
  });

});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    const name = screen.getByTestId('name-input');
  const surname = screen.getByTestId('lastName-input');
  const email = screen.getByTestId('email-input');
  const message = screen.getByTestId('message-input');

  await userEvent.type(name, 'Ahmet');
  await userEvent.type(surname, 'Yılmaz');
  await userEvent.type(email, 'ahmet@example.com');
  await userEvent.type(message, 'Merhaba, bu bir test mesajıdır.');

  const submitButton = screen.getByText('Gönder');
  await userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText('Ahmet')).toBeInTheDocument();
    expect(screen.getByText('Yılmaz')).toBeInTheDocument();
    expect(screen.getByText('ahmet@example.com')).toBeInTheDocument();
    expect(
      screen.getByText('Merhaba, bu bir test mesajıdır.')
    ).toBeInTheDocument();
  });
});
