using LAUNDRYMANAGMENTSYSTEM.Model;
using Microsoft.Data.SqlClient;
using System.Data;

namespace LAUNDRYMANAGMENTSYSTEM.Data
{
    public class PaymentData
    {
        string conn = "data source=DESKTOP-IM83I23\\SQLEXPRESS;database=LAUNDRYMANAGMENTDB;integrated security=true;trustservercertificate=true";

        // GET ALL
        public List<PaymentModel> GetAll()
        {
            List<PaymentModel> list = new List<PaymentModel>();

            try
            {
                SqlConnection con = new SqlConnection(conn);
                SqlDataAdapter da = new SqlDataAdapter("SELECT * FROM PAYMENTS", con);

                DataTable dt = new DataTable();
                da.Fill(dt);

                foreach (DataRow row in dt.Rows)
                {
                    list.Add(new PaymentModel
                    {
                        PaymentId = Convert.ToInt32(row["PAYMENTID"]),
                        OrderId = Convert.ToInt32(row["ORDERID"]),
                        Amount = Convert.ToDecimal(row["AMOUNT"]),
                        PaymentDate = Convert.ToDateTime(row["PAYMENTDATE"]),
                        PaymentMethod = row["PAYMENTMETHOD"].ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("GetAll Error: " + ex.Message);
            }

            return list;
        }

        // GET BY ID
        public PaymentModel GetById(int id)
        {
            PaymentModel payment = null;

            try
            {
                if (id <= 0) return null;

                using (SqlConnection con = new SqlConnection(conn))
                {
                    string query = "SELECT * FROM PAYMENTS WHERE PAYMENTID=@id";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id", id);

                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.Read())
                    {
                        payment = new PaymentModel
                        {
                            PaymentId = Convert.ToInt32(reader["PAYMENTID"]),
                            OrderId = Convert.ToInt32(reader["ORDERID"]),
                            Amount = Convert.ToDecimal(reader["AMOUNT"]),
                            PaymentDate = Convert.ToDateTime(reader["PAYMENTDATE"]),
                            PaymentMethod = reader["PAYMENTMETHOD"].ToString()
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("GetById Error: " + ex.Message);
            }

            return payment;
        }

        // INSERT
        public bool Insert(PaymentModel p)
        {
            if (p == null) return false;

            try
            {
                using (SqlConnection con = new SqlConnection(conn))
                {
                    string query = @"INSERT INTO PAYMENTS 
                                    (ORDERID, AMOUNT, PAYMENTDATE, PAYMENTMETHOD)
                                    VALUES (@orderId, @amount, @date, @method)";

                    SqlCommand cmd = new SqlCommand(query, con);

                    cmd.Parameters.AddWithValue("@orderId", p.OrderId);
                    cmd.Parameters.AddWithValue("@amount", p.Amount);
                    cmd.Parameters.AddWithValue("@date", p.PaymentDate);
                    cmd.Parameters.AddWithValue("@method", p.PaymentMethod);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Insert Error: " + ex.Message);
                return false;
            }
        }

        // UPDATE
        public bool Update(PaymentModel p)
        {
            if (p == null || p.PaymentId <= 0) 
                return false;

            try
            {
                using (SqlConnection con = new SqlConnection(conn))
                {
                    string query = @"UPDATE PAYMENTS 
                                    SET ORDERID=@orderId,
                                        AMOUNT=@amount,
                                        PAYMENTDATE=@date,
                                        PAYMENTMETHOD=@method
                                    WHERE PAYMENTID=@id";

                    SqlCommand cmd = new SqlCommand(query, con);

                    cmd.Parameters.AddWithValue("@id", p.PaymentId);
                    cmd.Parameters.AddWithValue("@orderId", p.OrderId);
                    cmd.Parameters.AddWithValue("@amount", p.Amount);
                    cmd.Parameters.AddWithValue("@date", p.PaymentDate);
                    cmd.Parameters.AddWithValue("@method", p.PaymentMethod);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Update Error: " + ex.Message);
                return false;
            }
        }

        // DELETE
        public bool Delete(int id)
        {
            if (id <= 0) return false;

            try
            {
                using (SqlConnection con = new SqlConnection(conn))
                {
                    string query = "DELETE FROM PAYMENTS WHERE PAYMENTID=@id";
                    SqlCommand cmd = new SqlCommand(query, con);

                    cmd.Parameters.AddWithValue("@id", id);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Delete Error: " + ex.Message);
                return false;
            }
        }
    }
}