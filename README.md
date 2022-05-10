# Create User Defined Functions in Couchbase with Javascript and Python

Learn to create User Defined Functions(UDF) in Couchbase using Javascript and Python

> This repo is designed to teach you how to create UDFs using Javascript for the Query service and UDFs using Python for the Analytics service in Couchbase.

Full documentation can be found on the Couchbase Developer Portal.

- [SQL++ UDFs using Javascript](https://developer.couchbase.com/tutorial-user-defined-functions-with-javascript)
- [Analytics UDFs using Python](https://developer.couchbase.com/tutorial-analytics-user-defined-functions-with-python)
<hr>

## UDF Examples
We have two different types of UDFs in Couchbase, using Javascript for the Query service and using Python for the Analytics service. Here, we showcase the same UDF functionality for the two services.
<hr>

### Query Service UDF using Javascript

Couchbase allows you to create User Defined Functions (UDF) with Javascript to include custom business logic inside your SQL++ queries while querying the data stored in Couchbase.

#### Importing the UDF in Couchbase

- The Javascript [code](javascript-udf/distance.js) can be imported directly using the `add function library` in the Couchbase Query Workbench under the UDF pane as a library.
- The UDFs can be defined using the `add function` in the Couchbase Query Workbench under the UDF pane as a library.

#### Testing the UDF in Couchbase

- `EXECUTE FUNCTION distance(51.5, 0, 38.8, -77.1)`

-  If the UDF is defined properly, there will be an output like the one shown below:

    ```sh
    [
      5918.185064088764
    ]
    ```
<hr>

### Analytics Service UDF using Python

Couchbase Analytics supports creating custom User Defined Functions using Python. Here, we create a custom UDF that calculates the distance between two GPS coordinates using the [Geodesic distance](https://en.wikipedia.org/wiki/Geodesics_on_an_ellipsoid).

#### Couchbase Setup

- Couchbase can be run as a Docker container

  > docker run -d -p 8091-8094:8091-8094 -p 11210:11210 --name db couchbase

- Setting Up

  - Access Couchbase Web Console at http://localhost:8091/

  - While setting up, enable Analytics, Data, Query and Indexing Service in Couchbase.

  - More information on setting up can be found [here](https://docs.couchbase.com/server/current/getting-started/do-a-quick-install.html).

- Import Data using Web Console

  The `travel-sample` bucket needs to be imported.

  More information on importing data can be found [here](https://docs.couchbase.com/server/current/manage/manage-settings/install-sample-buckets.html).

- Enabling Python UDFs on Couchbase by setting the Couchbase cluster into [Developer Preview Mode](https://docs.couchbase.com/server/current/developer-preview/preview-mode.html#how-do-i-enable-the-developer-preview-mode).

  > docker exec -it db bash /opt/couchbase/bin/couchbase-cli enable-developer-preview -c localhost:8091 -u <username> -p <password> --enable

#### Install requirements

- `$ pip install -r requirements.txt`

#### Testing the UDF

- Run the test [code](analytics-udf-python/distance-lib/test_distance_library.py).
  
  `$ python test_distance_library.py`

#### Importing the UDF into Couchbase

- The Python module can be packaged including all the dependencies using shiv for any platform. We use Linux here for our container.

  > $ shiv -o distance-lib.pyz --site-packages . --platform manylinux2010_x86_64 --python-version 39 --only-binary=:all: geopy

- Copy the package into the Couchbase Container

  `$ docker cp distance-lib.pyz db:/tmp/`

- Deploy the library into Couchbase Analytics Service

  > $ curl -X POST -u <username>:<password> -F "type=python" -F "data=@./tmp/distance-lib.pyz" localhost:8095/analytics/library/Default/distlib

- Create UDF in Couchbase Analytics Service

  > CREATE ANALYTICS FUNCTION distance_in_km(lat1, lon1, lat2, lon2) AS "distance_library", "Distance.calculate_geodesic_distance" AT distlib;

- Testing the UDF

  > SELECT distance_in_km(51.5, 0, 38.8, -77.1) as distance

  If the UDF is defined properly, there will be an output like the one shown below:

  ```json
  [
    {
      "distance": 5933.5299530300545
    }
  ]
  ```

## Conclusion

We walked through an example of how to create User Defined Functions (UDF) in Javascript and Python to calculate distances between two GPS coordinates, to import them into Couchbase and to use them in queries.
