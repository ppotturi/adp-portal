import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import { ExampleFetchComponent } from '../ExampleFetchComponent';
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';;
import { MemoryRouter } from 'react-router-dom';
import { LinkButton } from '@backstage/core-components';
import { ItemCardGrid } from '@backstage/core-components';
import { ItemCardHeader } from '@backstage/core-components';


export default {
   title: 'Layout/Item Cards',
  };
  
  const text =
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

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
          {[...Array(10).keys()].map(index => (
            <Card key={index}>
              <CardMedia>
                <ItemCardHeader title={`Card #${index}`} subtitle="Subtitle" />
              </CardMedia>
              <CardContent>
                {text
                  .split(' ')
                  .slice(0, 5 + Math.floor(Math.random() * 30))
                 .join(' ')}
              </CardContent>
              <CardActions>
                <LinkButton color="primary" to="/catalog">
                  Go There!
                </LinkButton>
              </CardActions>
            </Card>
          ))}
        </ItemCardGrid>
        </Content>
    </Page>
    );


// export const ExampleComponent = () => (
//   <Page themeId="tool">
//     <Header title="Azure Development Platform: Data" subtitle="ADP Data">
//     </Header>
//     <Content>
//       <ContentHeader title="ADP Data">
//         <SupportButton>A description of your plugin goes here.</SupportButton>
//       </ContentHeader>
//       <Grid container spacing={3} direction="column">
//         <Grid item>
//           <InfoCard title="Information card">
//             <Typography variant="body1">
//               All content should be wrapped in a card like this.
//             </Typography>
//           </InfoCard>
//         </Grid>
//         <Grid item>
//           <ExampleFetchComponent />
//         </Grid>
//       </Grid>
//     </Content>
    
//   </Page>
// );
