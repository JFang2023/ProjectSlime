import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Project Slime',
  description: 'We us project Slime to learn how to built a AI E-Commerce Platform',
  keywords: 'buy electronics, learn e-commerce',
};

export default Meta;
