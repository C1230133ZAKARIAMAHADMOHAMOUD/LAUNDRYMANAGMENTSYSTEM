using LAUNDRYMANAGMENTSYSTEM.Model;
using Microsoft.Data.SqlClient;
using System.Data;

namespace LAUNDRYMANAGMENTSYSTEM.Data
{
    public class ServiceData
    {
        string conn = "data source=DESKTOP-IM83I23\\SQLEXPRESS;database=LAUNDRYMANAGMENTDB;integrated security=true;trustservercertificate=true";

        public List<ServiceModel> GetAll()
        {
            List<ServiceModel> list = new List<ServiceModel>();

            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlDataAdapter da = new SqlDataAdapter("SELECT * FROM SERVICES", con);

                DataTable dt = new DataTable();
                da.Fill(dt);

                foreach (DataRow row in dt.Rows)
                {
                    list.Add(new ServiceModel
                    {
                        ServiceId = Convert.ToInt32(row["SERVICEID"]),
                        ServiceName = row["SERVICENAME"].ToString(),
                        Price = Convert.ToDecimal(row["PRICE"])
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Service GetAll Error: " + ex.Message);
            }

            return list;
        }

        // Get a service by its ID
        public ServiceModel GetById(int id)
        {
            ServiceModel service = null;

            try
            {
                if (id <= 0) 
                    return null;

                SqlConnection con = new SqlConnection(conn);

                string query = "SELECT * FROM SERVICES WHERE SERVICEID = @id";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@id", id);

                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    service = new ServiceModel
                    {
                        ServiceId = Convert.ToInt32(reader["SERVICEID"]),
                        ServiceName = reader["SERVICENAME"].ToString(),
                        Price = Convert.ToDecimal(reader["PRICE"])
                    };
                }

                con.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("GetById Error: " + ex.Message);
            }

            return service;
        }

        // Insert a new service
        public bool Insert(ServiceModel s)
        {
            if (s == null) 
                return false;

            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlCommand cmd = new SqlCommand("INSERT INTO SERVICES (SERVICENAME, PRICE) VALUES (@n,@p)", con);

                cmd.Parameters.AddWithValue("@n", s.ServiceName);
                cmd.Parameters.AddWithValue("@p", s.Price);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Service Insert Error: " + ex.Message);
                return false;
            }
        }

        // Update an existing service
        public bool Update(ServiceModel s)
        {
            if (s == null || s.ServiceId <= 0) 
                return false;

            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlCommand cmd = new SqlCommand("UPDATE SERVICES SET SERVICENAME=@n, PRICE=@p WHERE SERVICEID=@id", con);

                cmd.Parameters.AddWithValue("@id", s.ServiceId);
                cmd.Parameters.AddWithValue("@n", s.ServiceName);
                cmd.Parameters.AddWithValue("@p", s.Price);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Service Update Error: " + ex.Message);
                return false;
            }
        }

        // Delete a service by its ID
        public bool Delete(int id)
        {
            if (id <= 0) 
                return false;

            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlCommand cmd = new SqlCommand("DELETE FROM SERVICES WHERE SERVICEID=@id", con);

                cmd.Parameters.AddWithValue("@id", id);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Service Delete Error: " + ex.Message);
                return false;
            }
        }
    }
}