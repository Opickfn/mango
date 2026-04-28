<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Spatie\Permission\Models\Role;

echo "FIXING USER ROLES...\n";

// Ensure 'umkm' role exists
Role::firstOrCreate(['name' => 'umkm']);

foreach(User::all() as $u) {
    if($u->roles->isEmpty()) {
        echo "Assigning 'umkm' role to: " . $u->email . "\n";
        $u->assignRole('umkm');
        $u->save();
    }
}

echo "DONE.\n";
