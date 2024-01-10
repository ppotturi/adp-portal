import React from "react";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';;
import { LinkButton } from '@backstage/core-components';
import { ItemCardHeader } from '@backstage/core-components';

export default {
    title: 'Layout/Item Cards',
   };

export const CardExample = ({cardTitle, cardSubTitle, cardText}: {cardTitle: string, cardSubTitle:string, cardText:string}) => {
       return (
           <Card>
             <CardMedia>
               <ItemCardHeader title={cardTitle} subtitle={cardSubTitle} />
             </CardMedia>
             <CardContent>
               {cardText}
             </CardContent>
             <CardActions>
               <LinkButton color="primary" to="/catalog">
                 Add
               </LinkButton>
               <LinkButton color="primary" to="/catalog">
                 View
               </LinkButton>
             </CardActions>
           </Card>
       );
    };