import { defineEventHandler, readBody } from 'h3';

// Define the expected structure of the Kyanda callback payload
// This is for type safety and can be expanded based on Kyanda's full API documentation
interface KyandaCallbackData {
  category: string;
  source: string;
  Phone: string;
  MerchantID: string;
  details: {
    one: string;
    two: string;
  };
  Status: 'Success' | 'Failed' | 'Pending';
  status_code: string;
  message: string;
  Posted_Time: string;
  transactionRef: string;
  Amount: string;
}

export default defineEventHandler(async (event) => {
  try {
    const kyandaData: KyandaCallbackData = await readBody(event);

    console.log('Received Kyanda callback data:', kyandaData);

    // --- Your business logic goes here ---
    // 1. Verify the data using a secure token (if provided by Kyanda)
    //    For example, you might compare a signature or a unique transaction ID.
    // 2. Look up the original transaction in your database using `kyandaData.transactionRef`.
    // 3. Update the transaction's status in your database based on `kyandaData.Status`.
    // 4. Handle success and failure cases:
    //    - On success: Fulfill the user's order or service.
    //    - On failure: Log the error and potentially trigger a retry or alert.
    // 5. Send a response to Kyanda to acknowledge receipt.

    // Example of handling based on transaction status
    if (kyandaData.Status === 'Success') {
      // Logic for a successful transaction
      console.log(`Transaction ${kyandaData.transactionRef} was successful.`);
      // Update your database, send a confirmation email, etc.
    } else if (kyandaData.Status === 'Failed') {
      // Logic for a failed transaction
      console.error(`Transaction ${kyandaData.transactionRef} failed.`);
      // Log the failure reason, notify support, etc.
    }

    // Return a success response to Kyanda's server.
    // This acknowledges that your server received the callback.
    return {
      statusCode: 200,
      status: 'success',
      message: 'Callback received and processed successfully.',
    };
  } catch (error) {
    console.error('Error processing Kyanda callback:', error);
    // Return an error response if something went wrong on your end.
    // Kyanda may have a retry mechanism for failed callbacks.
    return {
      statusCode: 500,
      status: 'error',
      message: 'Internal Server Error',
    };
  }
});
