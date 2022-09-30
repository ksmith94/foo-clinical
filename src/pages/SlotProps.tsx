import { SlotProps } from './SlotDisplay';

export const slotProps: SlotProps = {
  date: new Date(),
  slots: [
    {
      resourceType: 'Slot',
      id: 'slot#1',
      start: new Date(2022, 7, 24, 11, 0, 0).toISOString(),
      end: new Date(2022, 7, 24, 11, 30, 0).toISOString(),
      appointmentType: {
        text: 'Checkup',
      },
      comment: 'Annual phsyical',
    },
    {
      resourceType: 'Slot',
      id: 'slot#2',
      start: new Date(2022, 7, 24, 13, 0, 0).toISOString(),
      end: new Date(2022, 7, 24, 14, 0, 0).toISOString(),
      appointmentType: {
        text: 'Surgery follow up',
      },
      comment: 'Post surgery follow up',
    },
    {
      resourceType: 'Slot',
      id: 'slot#3',
      start: new Date(2022, 7, 25, 13, 0, 0).toISOString(),
      end: new Date(2022, 7, 25, 14, 0, 0).toISOString(),
      appointmentType: {
        text: 'Consultation',
      },
      comment: 'Surgical consulation',
    },
    {
      resourceType: 'Slot',
      id: 'slot#4',
      start: new Date(2022, 7, 26, 10, 0, 0).toISOString(),
      end: new Date(2022, 7, 26, 16, 0, 0).toISOString(),
      appointmentType: {
        text: 'Surgery',
      },
      comment: 'Surgical removal of tumor',
    },
  ],
};
