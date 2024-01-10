import React from 'react';
import { Typography } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import { CardExample } from './Cards';
import { ItemCardGrid } from '@backstage/core-components';

export default {
   title: 'Layout/Item Cards',
  };
  
  export const ExampleComponent = () => (
    <Page themeId="tool">
    <Header title="Azure Development Platform: Data" subtitle="ADP Data">
    </Header>
    <Content>
      <ContentHeader title="ADP Data">
        <SupportButton>A description of your plugin goes here.</SupportButton>
      </ContentHeader>
      <Typography paragraph>
          The most basic setup is to place a bunch of cards into a large grid,
          leaving styling to the defaults. Try to resize the window to see how they
          rearrange themselves to fit the viewport.
        </Typography>
        <ItemCardGrid>
        <CardExample 
          cardTitle='ALB'
          cardSubTitle='ADP' 
          cardText='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
          pathToAdd='/catalog'
          pathToView='/catalog'
        />
        <CardExample 
          cardTitle='Delivery Programmes'
          cardSubTitle='ADP' 
          cardText='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
          pathToAdd='/catalog'
          pathToView='/catalog'
        />
        <CardExample 
          cardTitle='Teams'
          cardSubTitle='ADP' 
          cardText='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
          pathToAdd='/catalog'
          pathToView='/catalog'
        />
        </ItemCardGrid>
        </Content>
    </Page>
    );