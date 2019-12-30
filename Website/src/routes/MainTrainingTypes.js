import React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import getWordEnding from 'src/utils/getWordEnding';
import useTrainingWordPairs from 'src/hooks/useTrainingWordPairs';
import withLocalStorageData from 'src/HOCs/withLocalStorageData';
import Card from 'src/components/Card';
import CardContent from 'src/components/CardContent';
import CardActions from 'src/components/CardActions';
import Typography from 'src/components/Typography';
import Link from 'src/components/Link';
import Typoghraphy from 'src/components/Typography';
import TrainingTypesSettings from 'src/layout/TrainingTypesSettings';
import TrainingCardSection from 'src/layout/TrainingCardSection';
import TrainingSchoolIcon from 'src/layout/TrainingSchoolIcon';

function MainTrainingTypes({ trainingTypesInfo, localData }) {
  const trainingWordPairs = useTrainingWordPairs();

  const match = useRouteMatch();

  return (
    <>
      <TrainingTypesSettings />
      <Grid container spacing={3}>
        {trainingTypesInfo.map(({ typeId, title, description }) => {
          return (
            <Grid key={typeId} item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography as="h2" variant="h5" gutterBottom>
                    {title}
                  </Typography>
                  <Typoghraphy as="p">{description}</Typoghraphy>
                  <TrainingCardSection>
                    <TrainingSchoolIcon />
                    <span>
                      На повторение: {trainingWordPairs.length} слов
                      {getWordEnding(trainingWordPairs.length)}
                    </span>
                  </TrainingCardSection>
                </CardContent>
                <CardActions>
                  <Link
                    variant="body1"
                    as={RouterLink}
                    to={`${match.url}/${typeId}/0`}
                  >
                    Поплыли
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}

export default withLocalStorageData(MainTrainingTypes, [
  'training-words-quantity'
]);