import { Button } from '@/components/ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { HOME_CONSTANTS } from '../lib/constants';

const Home = () => {
  return (
    <div className="container">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl md:text-4xl text-center">
          {HOME_CONSTANTS.TITLE}
        </h1>
        <p className="max-w-3xl text-center">{HOME_CONSTANTS.DESCRIPTION}</p>
        <div className="flex items-center gap-2">
          <Button>
            <a href={HOME_CONSTANTS.BUTTONS.PRIMARY.href}>
              {HOME_CONSTANTS.BUTTONS.PRIMARY.title}
            </a>
          </Button>
          <Button variant={'secondary'}>
            <a
              href={HOME_CONSTANTS.BUTTONS.SECONDARY.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              <GitHubLogoIcon className="mr-2 h-4 w-4 inline" />{' '}
              {HOME_CONSTANTS.BUTTONS.SECONDARY.title}
            </a>
          </Button>
        </div>
        <div className="text-gray-300 flex flex-col items-center mt-4 gap-2">
          <span>{HOME_CONSTANTS.BUILT_AND_TESTED_WITH}</span>
          <div className="flex gap-4">
            {HOME_CONSTANTS.TECH_STACK.map(({ Icon, key }) => (
              <Icon key={key} size={32} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
