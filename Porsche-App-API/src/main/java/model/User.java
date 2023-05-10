package model;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class User {
  private String fullName;
  private String username;
  private String password;

  public User (String fullName, String username, String password) {
    this.fullName = fullName;
    this.username = username;
    this.password = password;
  }

  public String getFullName() {
    return fullName;
  }
  public String getUsername() {
    return username;
  }
  public String getPassword() {
    return password;
  }
  public void setFullName(String fullName) {
    this.fullName = fullName;
  }
  public void setUsername(String username) {
    this.username = username;
  }
  public void setPassword (String password) {
    this.password = password;
  }

  public String hashPassword() {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hashedBytes = digest.digest(password.getBytes(StandardCharsets.UTF_8));

      // Convert the byte array to a hexadecimal string
      StringBuilder stringBuilder = new StringBuilder();
      for (byte byteBeingHashed : hashedBytes) {
        stringBuilder.append(String.format("%02x", byteBeingHashed));
      }
      return stringBuilder.toString();
    } catch (NoSuchAlgorithmException e) {
      // Handle exception if the specified algorithm is not available
      e.printStackTrace();
    }
    return null; // Return null if hashing fails
  }
}
