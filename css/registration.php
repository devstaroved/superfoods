<?php
require_once 'connection.php';

$link = mysqli_connect($host, $user, $password, $database) or die('Ошибка подключения к базе данных');
mysqli_character_set_name($link);
mysqli_set_charset($link, "utf8");

# получаем все инфу с формы и пакуем массив с данными
writeToLog($_POST, 'Пришедшие данные');

function getVar($name)
{
	$name = isset($_POST[$name]) ? trim($_POST[$name]) : null;
	$name = addcslashes($name, "'");
	return $name;
}

function GetClearPhoneNumber($number) {
	if (empty($number)) {
		return "";
	}
	$number = str_replace('(', '', $number);
	$number = str_replace(')', '', $number);
	$number = str_replace('-', '', $number);
	$number = str_replace('+', '', $number);
	return $number;
}


if (empty($name)) {
	$name = getVar('name');
}

if (empty($phone)) {
	$phone = getVar('phone');
}

if (empty($email)) {
	$email = getVar('email');
}


$cleanName = preg_replace('/\s+/', ' ', trim($name));
$fullName = explode(' ', $cleanName, 2);


$data2 = array( 
    'first_name' => $fullName[0],
    'last_name' => (empty($fullName[1]) ? '-' : $fullName[1]),
    'phone'     => GetClearPhoneNumber($phone),
    'email'     => getVar('email'),
    'order_type' => getVar('order_type'),
    'registration_type' => getVar('registration_type'),
    'date_visited' => date("d.m.Y"),
    'time_visited' => date("G:i:s"),
    'page_url' => getVar('page_url'),
    'user_agent' => $_SERVER['HTTP_USER_AGENT'],
    'utm_source' => getVar('utm_source'),
    'utm_campaign' => getVar('utm_campaign'),
    'utm_medium' => getVar('utm_medium'),
    'utm_term' => getVar('utm_term'),
    'utm_content' => getVar('utm_content'),
    'ref' => getVar('ref'),
    'ip_address' => getVar('ip_address'),
    'city' => getVar('city'),
    'region' => getVar('region'),
    'country' => getVar('country'),
    'client_id' => getVar('client_id'),
    'utmcsr' => getVar('utmcsr'),
    'utmccn' => getVar('utmccn'),
    'utmcmd' => getVar('utmcmd'),
    'affiliate_id' => getVar('affiliate_id'),
    'click_id' => getVar('click_id'),
    'referrer' => isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : ''
);

// Условие для записи, если все UTM равны "tiktok"
if (
    getVar('utm_source') === 'tiktok' &&
    getVar('utm_medium') === 'tiktok' &&
    getVar('utm_campaign') === 'tiktok' &&
    getVar('utm_content') === 'tiktok'
) {
    // Преобразуем массив в строку JSON
    $logEntry = date('Y-m-d H:i:s') . " - TikTok Visit: " . json_encode($data2, JSON_UNESCAPED_UNICODE) . "\n";

    // Записываем в лог-файл
    file_put_contents('tiktok_log.txt', $logEntry, FILE_APPEND);
}


$data = array(
	'first_name' => $fullName[0],
	'last_name' => (empty($fullName[1]) ? '-' : $fullName[1]),
	'phone'     => GetClearPhoneNumber($phone),
	'email'     => getVar('email'),
	'order_type' => getVar('order_type'),
	'registration_type' => getVar('registration_type'),
	'date_visited' => date("d.m.Y"),
	'time_visited' => date("G:i:s"),
	'page_url' => getVar('page_url'),
	'user_agent' => $_SERVER['HTTP_USER_AGENT'],
	'utm_source' => getVar('utm_source'),
	'utm_campaign' => getVar('utm_campaign'),
	'utm_medium' => getVar('utm_medium'),
	'utm_term' => getVar('utm_term'),
	'utm_content' => getVar('utm_content'),
	'ref' => getVar('ref'),
	'ip_address' => getVar('ip_address'),
	'city' => getVar('city'),
	'region' => getVar('region'),
	'country' => getVar('country'),
	'client_id' => getVar('client_id'),
	'utmcsr' => getVar('utmcsr'),
	'utmccn' => getVar('utmccn'),
	'utmcmd' => getVar('utmcmd'),
	'affiliate_id' => getVar('affiliate_id'),
	'click_id' => getVar('click_id')
);

if (
    getVar('utm_source') === 'tiktok' &&
    getVar('utm_medium') === 'tiktok' &&
    getVar('utm_campaign') === 'tiktok' &&
    getVar('utm_content') === 'tiktok'
) {
    $referrer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
    if ($referrer) {
        // Разбираем URL реферера
        $urlParts = parse_url($referrer);
        if (isset($urlParts['query'])) {
            // Извлекаем query-параметры
            parse_str($urlParts['query'], $queryParams);
            
            // Обновляем UTM-параметры в $data2, если они есть в реферере
            $data['utm_source'] = isset($queryParams['utm_source']) ? addcslashes($queryParams['utm_source'], "'") : $data['utm_source'];
            $data['utm_medium'] = isset($queryParams['utm_medium']) ? addcslashes($queryParams['utm_medium'], "'") : $data['utm_medium'];
            $data['utm_campaign'] = isset($queryParams['utm_campaign']) ? addcslashes($queryParams['utm_campaign'], "'") : $data['utm_campaign'];
            $data['utm_content'] = isset($queryParams['utm_content']) ? addcslashes($queryParams['utm_content'], "'") : $data['utm_content'];
            $data['utm_term'] = isset($queryParams['utm_term']) ? addcslashes($queryParams['utm_term'], "'") : $data['utm_term'];
        }
    }
}

if( (getVar('utm_campaign') === '__CAMPAIGN_NAME__' && getVar('utm_content') === '__CID_NAME__') ||  getVar('utm_campaign') === '' &&
    getVar('utm_content') === ''){
		$referrer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
    if ($referrer) {
        // Разбираем URL реферера
        $urlParts = parse_url($referrer);
        if (isset($urlParts['query'])) {
            // Извлекаем query-параметры
            parse_str($urlParts['query'], $queryParams);
            
            // Обновляем UTM-параметры в $data2, если они есть в реферере
            
            $data['utm_campaign'] = isset($queryParams['utm_campaign']) ? addcslashes($queryParams['utm_campaign'], "'") : $data['utm_campaign'];
            $data['utm_content'] = isset($queryParams['utm_content']) ? addcslashes($queryParams['utm_content'], "'") : $data['utm_content'];
    $logEntry = date('Y-m-d H:i:s') . " - TikTok Visit: " . json_encode($data, JSON_UNESCAPED_UNICODE) . "\n";

    // Записываем в лог-файл
    file_put_contents('tiktok_log-emty.txt', $logEntry, FILE_APPEND);
        }
		
	}
}
// Построение SQL-оператора
$query = "INSERT INTO
        `leads`(
                  `first_name`,
                  `last_name`,
                  `email`,
                  `phone`,
                  `registrationType`,
                  `orderType`,
                  `date_visited`,
                  `time_visited`,
                  `page_url`,
                  `user_agent`,
                  `utm_source`,
                  `utm_campaign`,
                  `utm_medium`,
                  `utm_term`,
                  `utm_content`,
                  `ref`,
                  `ip_address`,
                  `city`,
                  `region`,
                  `country`,
                  `client_id`,
                  `utmcsr`,
                  `utmccn`,
                  `utmcmd`,
                  `affiliate_id`,
                  `click_id`
                  ) 
        VALUES('".$data['first_name']."',
                '".$data['last_name']."',
                '".$data['email']."',
                '".$data['phone']."',
                '".$data['registration_type']."',
                '".$data['order_type']."',
                '".$data['date_visited']."',
                '".$data['time_visited']."',
                '".$data['page_url']."',
                '".$data['user_agent']."',
                '".$data['utm_source']."',
                '".$data['utm_campaign']."',
                '".$data['utm_medium']."',
                '".$data['utm_term']."',
                '".$data['utm_content']."',
                '".$data['ref']."',
                '".$data['ip_address']."',
                '".$data['city']."',
                '".$data['region']."',
                '".$data['country']."',
                '".$data['client_id']."',
                '".$data['utmcsr']."',
                '".$data['utmccn']."',
                '".$data['utmcmd']."',
                '".$data['affiliate_id']."',
                '".$data['click_id']."')";
// SQL-оператор выполняется

mysqli_query($link, $query) or die('SQL-запрос не обработан');


// Закрытие соединения
mysqli_close($link);

//require_once 'slack/hook.php';


//require_once 'mailchimp.php';
//require_once 'amo/index.php';
require_once 'mail.php';
//require_once 'amo.php';

//Send Order to keycrm
$source_id = 1;
/*if ($data["utm_source"] == "google") {
	$source_id = 10;
}
if ($data["utm_source"] == "blogger") {
    $source_id = 12;
}
*/
$productName = $data['order_type'];
$pattern = '/\D+/';
$numbers = preg_replace($pattern, '', $productName);


$pattern = '/(\d+)гр/';
$phrase = preg_replace($pattern, '', $productName );
$trimmedPhrase = trim($phrase);
$sku = "";
if($trimmedPhrase == "Заказ спирулины в попрошке" ){
	$sku = "СП".$numbers;
}
if($trimmedPhrase == "Заказ спирулины в таблетках" ){
	$sku = "СT".$numbers;
}
$data = [
		"source_id" => $source_id, // Source in KeyCRM
		"buyer" => [
				"full_name"=> $data['first_name']." ".$data['last_name'],
				"email"=> $data['email'],
				"phone"=> $data['phone']
		],
		"marketing"=> [
			"utm_source"=> $data["utm_source"],
			"utm_medium"=> $data["utm_medium"],
			"utm_campaign"=> $data["utm_campaign"],
			"utm_term"=> $data["utm_term"],
			"utm_content"=> $data["utm_content"]
		],
		"products"=> [
            [
            	"sku" => $sku,
                "price"=> 0, // цена продажи
                "quantity"=> 0, // количество проданного товара
                "name"=> $data['order_type'], // название товара
                "picture"=> "", // картинка товара
                "properties"=>[
					[
						"name"=> "Тип заявки",
						"value"=> $data['registration_type']
					],
					[
						"name"=> "Адреса заявки",
						"value"=> $data['page_url']
					]
				]
			]
		],
		
		 "custom_fields" => [
        [
            "uuid" => "OR_1030",
            "value" => ["лендінг"]
        ]
    ]
];

//  "упаковываем данные"
$data_string = json_encode($data);

// Ваш уникальный API ключ KeyCRM
$token = 'MzQzZGZhOTA5NmYzYzM1NjJjNzQzNjdkNzA0ZjJkNmIyZDNiMGJjYw';

// отправляем на сервер
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://openapi.keycrm.app/v1/order");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS,$data_string);
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
		"Content-type: application/json",
		"Accept: application/json",
		"Cache-Control: no-cache",
		"Pragma: no-cache",
		'Authorization:  Bearer ' . $token)
);
$result = curl_exec($ch);
curl_close($ch);

die(json_encode([
	'status' => 'success'
]));

function writeToLog($data, $title = ''){
	$log = "\n------------------------\n";
	$log .= date("Y.m.d G:i:s") . "\n";
	$log .= (strlen($title) > 0 ? $title : 'DEBUG') . "\n";
	$log .= print_r($data, 1);
	$log .= "\n------------------------\n";
	file_put_contents(getcwd() . '/hookTest.log', $log, FILE_APPEND);
	return true;
}
