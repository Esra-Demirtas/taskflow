<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 * version="1.0.0",
 * title="TaskFlow API Dokümantasyonu",
 * description="TaskFlow uygulaması için kapsamlı API dokümantasyonu",
 * @OA\Contact(
 * email="support@taskflow.com"
 * ),
 * @OA\License(
 * name="Apache 2.0",
 * url="http://www.apache.org/licenses/LICENSE-2.0.html"
 * )
 * )
 *
 * @OA\Server(
 * url=L5_SWAGGER_CONST_HOST,
 * description="Yerel API Sunucusu"
 * )
 *
 * @OA\Tag(
 * name="Auth",
 * description="Kimlik Doğrulama İşlemleri"
 * )
 * @OA\Tag(
 * name="Users",
 * description="Kullanıcı Yönetimi İşlemleri"
 * )
 * @OA\Tag(
 * name="Todos",
 * description="Todo Listesi İşlemleri"
 * )
 * @OA\Tag(
 * name="Categories",
 * description="Kategori Yönetimi İşlemleri"
 * )
 * @OA\Tag(
 * name="Stats",
 * description="Genel İstatistik İşlemleri"
 * )
 *
 * @OA\Components(
 * @OA\Response(
 * response="UnauthorizedError",
 * description="Kimlik doğrulama başarısız.",
 * @OA\JsonContent(
 * @OA\Property(property="status", type="string", example="error"),
 * @OA\Property(property="message", type="string", example="Kimlik doğrulama başarısız.")
 * )
 * ),
 * @OA\Response(
 * response="ValidationError",
 * description="Doğrulama hatası.",
 * @OA\JsonContent(
 * @OA\Property(property="message", type="string", example="Verilen veriler geçersiz."),
 * @OA\Property(property="errors", type="object", example={"email": {"E-posta adresi zaten alınmış."}})
 * )
 * )
 * )
 */
class OpenApiSpec extends Controller
{
    // Bu sınıf sadece global Swagger anotasyonlarını barındırır.
    // İçinde herhangi bir metod veya mantık bulunmasına gerek yoktur.
}
