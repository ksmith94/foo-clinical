import { Button } from '@medplum/react';
import React, { useMemo, useState } from 'react';
import './Calendar.css';

interface CalendarProps {
  onClick: (date: Date) => void;
}

interface CalendarCell {
  date: Date;
}

type OptionalCalendarCell = CalendarCell | undefined;

export function Calendar(props: CalendarProps): JSX.Element | null {
  const [month, setMonth] = useState<Date>(getStartMonth);

  function changeMonth(change: number): void {
    setMonth((currMonth) => {
      const prevMonth = new Date(currMonth.getTime());
      prevMonth.setMonth(currMonth.getMonth() + change);
      return prevMonth;
    });
  }

  const grid = useMemo(() => buildGrid(month), [month]);
  return (
    <div className="medplum-calendar">
      <p className="month-button">
        <Button label="Previous month" onClick={() => changeMonth(-1)}>
          &lt;
        </Button>
      </p>
      <h1>{month.toLocaleString('default', { month: 'long' }) + ' ' + month.getFullYear()}</h1>
      <p className="month-button">
        <Button label="Next month" onClick={() => changeMonth(1)}>
          &gt;
        </Button>
      </p>
      <table className="calendar-grid">
        <thead>
          <tr>
            <th>SUN</th>
            <th>MON</th>
            <th>TUE</th>
            <th>WED</th>
            <th>THU</th>
            <th>FRI</th>
            <th>SAT</th>
          </tr>
        </thead>
        <tbody>
          {grid.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => (
                <td key={dayIndex}>
                  {day && <button onClick={() => props.onClick(day.date)}>{day?.date.getDate()}</button>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function getStartMonth(): Date {
  const result = new Date();
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

function buildGrid(startDate: Date): OptionalCalendarCell[][] {
  const d = new Date(startDate.getFullYear(), startDate.getMonth());
  const grid: OptionalCalendarCell[][] = [];
  let row: OptionalCalendarCell[] = [];

  for (let i = 0; i < d.getDay(); i++) {
    row.push(undefined);
  }

  while (d.getMonth() === startDate.getMonth()) {
    row.push({
      date: new Date(d.getTime()),
    });

    if (d.getDay() === 6) {
      grid.push(row);
      row = [];
    }

    d.setDate(d.getDate() + 1);
  }

  if (d.getDay() !== 0) {
    for (let i = d.getDay(); i < 7; i++) {
      row.push(undefined);
    }
    grid.push(row);
  }
  return grid;
}
