<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Support\Facades\Schema;

$table = 'answers';
echo "Columns in $table:\n";
$columns = Schema::getColumnListing($table);
foreach($columns as $column) {
    echo "- $column\n";
}
