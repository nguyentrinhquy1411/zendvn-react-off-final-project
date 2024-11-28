import React from 'react';

function ErrorPage() {
  return (
    <div style={styles.container}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

const styles = {
  container: {
    margin: '50px', // Adds margin around the content
    textAlign: 'center', // Centers the text
  },
};

export default ErrorPage;
