import {
  SiPlaywright,
  SiJest,
  SiNestjs,
  SiVite,
  SiReact,
  SiBruno,
} from 'react-icons/si';

export const HOME_CONSTANTS = {
  TITLE: 'Play2Do: The Task Manager That Masters Testing',
  DESCRIPTION:
    'Dive into a fully-functional todo app built with NestJS and React, where every feature is an opportunity to master QA. Explore comprehensive test coverage with Jest, Playwright, and Bruno - because in Play2Do, writing todos means writing tests.',
  BUILT_AND_TESTED_WITH: 'BUILT AND TESTED WITH',
  BUTTONS: {
    PRIMARY: {
      title: 'Get Started',
      href: '/login',
    },
    SECONDARY: {
      title: 'Source Code',
      href: 'https://github.com/jalolk/play2do',
    },
  },
  TECH_STACK: [
    { Icon: SiNestjs, key: 'nestjs' },
    { Icon: SiVite, key: 'vite' },
    { Icon: SiReact, key: 'react' },
    { Icon: SiPlaywright, key: 'playwright' },
    { Icon: SiJest, key: 'jest' },
    { Icon: SiBruno, key: 'bruno' },
  ],
};
