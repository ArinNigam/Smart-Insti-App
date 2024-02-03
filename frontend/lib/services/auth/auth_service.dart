import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;

import '../../components/snackbar.dart';
import '../../constants/error_handling.dart';

class AuthService {
  final storage = FlutterSecureStorage();
  final String baseUrl =
      'http://10.0.2.2:3000'; // Replace with your backend API URL
  Future<void> signUpAdmin({
    required BuildContext context,
    required String email,
    required String password,
  }) async {
    try {
      http.Response res = await http.post(
        Uri.parse('$baseUrl/signup'),
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      httpErrorHandle(
        response: res,
        context: context,
        onSuccess: () {
          showSnackBar(
            context,
            'Account created! Login with the same credentials!',
          );
        },
      );
    } catch (e) {
      showSnackBar(context, e.toString());
      print(e);
    }
  }

  Future<void> signInAdmin({
    required BuildContext context,
    required String email,
    required String password,
  }) async {
    try {
      http.Response res = await http.post(
        Uri.parse('$baseUrl/signin'),
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      httpErrorHandle(
        response: res,
        context: context,
        onSuccess: () async {
          context.go('/admin_home');
        },
      );
    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }

  Future<void> sendOTP({
    required BuildContext context,
    required String email,
  }) async {
    try {
      http.Response response = await http.post(
        Uri.parse('$baseUrl/send-otp'),
        body: jsonEncode({'email': email}),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );
      httpErrorHandle(
        response: response,
        context: context,
        onSuccess: () {
          showSnackBar(
            context,
            'OTP sent successfully',
          );
        },
      );
    } catch (e) {
      showSnackBar(context, e.toString());
      print(e);
    }
  }

  Future<bool> verifyOTP(String email, String otp, String userType) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/verify-otp'),
        body: jsonEncode({'email': email, 'otp': otp, 'userType': userType}),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        final String jwt = data['token'];
        await storage.write(key: 'jwt', value: jwt);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      print(e);
      return false;
    }
  }

  Future<void> loginUser({
    required BuildContext context,
    required String email,
    required String userType,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        // headers: <String, String>{
        //   'Content-Type': 'application/json; charset=UTF-8',
        //   'Authorization': 'Bearer ${await storage.read(key: 'jwt')}',
        // },
        body: jsonEncode({'email': email, 'userType': userType}),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );
      httpErrorHandle(
        response: response,
        context: context,
        onSuccess: () {
          showSnackBar(
            context,
            'User Created Successfully!',
          );
        },
      );
    } catch (e) {
      showSnackBar(context, e.toString());
      print(e);
    }
  }
}
