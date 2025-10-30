export const NotificationStyles = {
  success: {
    class: 'text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200',
    icon: `
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707
        8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9
        10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
      `,
    iconName: 'Check icon',
  },
  error: {
    class: 'text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200',
    icon: `
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0
        0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414
        1.414L10 11.414l-2.293 2.293a1 1 0 0
        1-1.414-1.414L8.586 10 6.293 7.707a1 1
        0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1
        0 0 1 1.414 1.414L11.414 10l2.293
        2.293Z"/>
      `,
    iconName: 'Error icon',
  },
  warning: {
    class: 'text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200',
    icon: `
        <path d="M10 .5a9.5 9.5 0 1 0 9.5
        9.5A9.51 9.51 0 0 0 10
        .5ZM10 15a1 1 0 1
        1 0-2 1 1 0 0 1 0
        2Zm1-4a1 1 0 0
        1-2 0V6a1 1 0 0
        1 2 0v5Z"/>
      `,
    iconName: 'Warning icon',
  },
  info: {
    class: 'text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200',
    icon: `
      <path d="M18 10A8 8 0 1 1 2
      10a8 8 0 0 1 16 0ZM9 9a1 1 0
      1 0 0-2 1 1 0 0 0 0 2Zm1
      7a1 1 0 0 0 1-1v-4a1 1
      0 1 0-2 0v4a1 1 0 0 0 1 1Z"/>
    `,
    iconName: 'Info icon',
  },
} as const;
