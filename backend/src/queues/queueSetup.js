const { Queue } = require('bullmq');
const { connection } = require('./connection');

const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
  removeOnComplete: true,
  removeOnFail: false, // We want to inspect failed jobs or move them to DLQ
};

const communicationsQueue = new Queue('communications', { connection, defaultJobOptions });
const remindersQueue = new Queue('reminders', { connection, defaultJobOptions });
const noShowEnforcerQueue = new Queue('no-show-enforcer', { connection, defaultJobOptions });
const paymentDripQueue = new Queue('payment-drip', { 
  connection, 
  defaultJobOptions: {
    ...defaultJobOptions,
    attempts: 5, // Payment retry more
  }
});
const failedJobsQueue = new Queue('failed-jobs', { connection, defaultJobOptions });

module.exports = {
  communicationsQueue,
  remindersQueue,
  noShowEnforcerQueue,
  paymentDripQueue,
  failedJobsQueue,
};
