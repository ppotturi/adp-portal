import React from 'react';
import { Typography } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import { CardTemplate } from './CardComponent';
import { ItemCardGrid } from '@backstage/core-components';

export default {
   title: 'Layout/Item Cards',
  };
  
  export const LandingPageComponent = () => (
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
        <CardTemplate 
          cardTitle='ALB'
          cardSubTitle='ADP' 
          cardText='Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
          pathToAdd='/catalog'
          pathToView='/catalog'
        />
        <CardTemplate 
          cardTitle='Delivery Programmes'
          cardSubTitle='ADP' 
          cardText='Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
          pathToAdd='/catalog'
          pathToView='/catalog'
        />
        </ItemCardGrid>
        </Content>
        </Page>
    );