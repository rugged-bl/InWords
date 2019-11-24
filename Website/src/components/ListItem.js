import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const ListItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-top: ${props => (props.dense ? '4px' : '6px')};
  padding-right: ${props => (props.hasSecondaryAction ? '56px' : '16px')};
  padding-bottom: ${props => (props.dense ? '4px' : '6px')};
  padding-left: 16px;
  ${props => props.theme.typography.body1}
`;

ListItem.propTypes = {
  hasSecondaryAction: PropTypes.bool.isRequired
};

export default ListItem;
