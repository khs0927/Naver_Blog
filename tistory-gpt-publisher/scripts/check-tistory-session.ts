import { checkTistorySession } from '../src/publisher/tistory';

checkTistorySession()
  .then((result) => {
    console.log('Tistory session check:', result);
  })
  .catch((error) => {
    console.error('Tistory session check failed:', error);
    process.exit(1);
  });
