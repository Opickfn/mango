<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "USER ROLES CHECK:\n";
foreach(App\Models\User::all() as $u) {
    echo $u->email . " => " . implode(',', $u->getRoleNames()->toArray()) . "\n";
}
