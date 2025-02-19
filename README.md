# Event Registration with the Cloud

## Usage Steps

1. Add the `.env` file
2. In the file, add the following:

    ```
    DATABASE_URL=<DATABASE_URL>
    ```
3. Before running the FastAPI server, ensure that you are connected to the RDS through the SSH tunnel! (As mentioned in the RDS_Config_Help.docx file)

4. Run the FastAPI server by executing the following command:

    ```
    uvicorn main:app --host 0.0.0.0 --port 8080 --reload
    ```

5. You can now access the server on `127.0.0.1:8080`.

6. Endpoints:

    ```
        /      -> Root
        /users -> Lists all users in the database
    ```