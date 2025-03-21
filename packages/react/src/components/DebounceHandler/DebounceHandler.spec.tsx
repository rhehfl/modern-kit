import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderSetup } from '../../_internal/test/renderSetup';
import { DebounceHandler } from '.';
import { ChangeEvent, useState } from 'react';
import { act, screen } from '@testing-library/react';

beforeEach(() => {
  // https://github.com/testing-library/user-event/issues/833#issuecomment-1725364780
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

interface TestComponentProps {
  capture: string;
  wait: number;
}

interface ButtonTestComponentProps extends TestComponentProps {
  onClick: () => void;
}

const TestComponentWithButton = ({
  capture,
  onClick,
  wait,
}: ButtonTestComponentProps) => {
  return (
    <DebounceHandler capture={capture} wait={wait}>
      <button onClick={onClick}>Button</button>
    </DebounceHandler>
  );
};

const TestInput = ({ onChange }: { onChange: (value: string) => void }) => {
  const [value, setValue] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    act(() => setValue(e.target.value));
    onChange(e.target.value);
  };

  return <input type="text" onChange={handleChange} value={value} />;
};

const TestComponentWithInput = ({ capture, wait }: TestComponentProps) => {
  const [text, setText] = useState('');

  const onChange = (value: string) => {
    act(() => setText(value));
  };

  return (
    <>
      <DebounceHandler capture={capture} wait={wait}>
        <TestInput onChange={onChange} />
      </DebounceHandler>
      <p role="paragraph">{text}</p>
    </>
  );
};

describe('DebounceHandler', () => {
  it('자식 요소의 onClick 이벤트를 디바운스해야 합니다.', async () => {
    const mockFn = vi.fn();
    // https://github.com/testing-library/user-event/issues/833
    const { user } = renderSetup(
      <TestComponentWithButton capture="onClick" onClick={mockFn} wait={500} />,
      { delay: null }
    );

    const button = screen.getByRole('button');
    await user.click(button);

    vi.advanceTimersByTime(300);
    expect(mockFn).not.toBeCalled();

    vi.advanceTimersByTime(200);
    expect(mockFn).toBeCalledTimes(1);

    await user.click(button);
    await user.click(button);
    await user.click(button);

    vi.advanceTimersByTime(300);
    expect(mockFn).toBeCalledTimes(1);

    await vi.advanceTimersByTimeAsync(200);
    expect(mockFn).toBeCalledTimes(2);
  });

  it('자식 요소의 onChange 이벤트를 디바운스해야 합니다.', async () => {
    const { user } = renderSetup(
      <TestComponentWithInput capture="onChange" wait={500} />,
      { delay: null }
    );

    const input = screen.getByRole('textbox');
    const paragraph = screen.getByRole('paragraph');

    await user.type(input, 'Debounce');

    vi.advanceTimersByTime(300);
    expect(paragraph).toHaveTextContent('');
    expect(input).toHaveValue('Debounce');

    vi.advanceTimersByTime(200);
    expect(paragraph).toHaveTextContent('Debounce');
    expect(input).toHaveValue('Debounce');

    await user.type(input, ' Test');

    vi.advanceTimersByTime(300);
    expect(paragraph).toHaveTextContent('Debounce');
    expect(input).toHaveValue('Debounce Test');

    vi.advanceTimersByTime(200);
    expect(paragraph).toHaveTextContent('Debounce Test');
    expect(input).toHaveValue('Debounce Test');
  });
});
