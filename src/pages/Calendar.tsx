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
  const [month] = useState<Date>(getStartMonth);

  const grid = useMemo(() => buildGrid(month), [month]);
  return (
    <div className="medplum-calendar">
      <h1>{month.toLocaleString('default', { month: 'long' }) + ' ' + month.getFullYear()}</h1>
      <table>
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
          {grid.map((week) => (
            <tr>
              {week.map((day) => (
                <td>{day && <button onClick={() => props.onClick(day.date)}>{day?.date.getDate()}</button>}</td>
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
